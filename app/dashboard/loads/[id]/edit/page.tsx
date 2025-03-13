"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define the form schema
const formSchema = z.object({
  materialType: z.string(),
  weight: z.coerce.number().positive(),
  source: z.object({
    placeName: z.string().min(1, "Source location is required"),
    coordinates: z.array(z.number()).length(2),
  }),
  destination: z.object({
    placeName: z.string().min(1, "Destination location is required"),
    coordinates: z.array(z.number()).length(2),
  }),
  vehicleBodyType: z.enum(["OPEN_BODY", "CLOSED_BODY"]),
  vehicleType: z.enum(["TRAILER", "TRUCK", "HYVA"]),
  numberOfWheels: z.coerce.number().positive(),
  offeredAmount: z.object({
    total: z.coerce.number().positive(),
    advanceAmount: z.coerce.number().nonnegative(),
    dieselAmount: z.coerce.number().nonnegative(),
  }),
  whenNeeded: z.enum(["IMMEDIATE", "SCHEDULED"]),
  scheduleDate: z.date().optional(),
  isActive: z.boolean(),
  expiresAt: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

// Define API response types
interface LoadResponse {
  success: boolean;
  load: {
    _id: string;
    materialType: string;
    weight: number;
    source: {
      placeName: string;
      coordinates: number[];
      type: string;
    };
    destination: {
      placeName: string;
      coordinates: number[];
      type: string;
    };
    vehicleBodyType: "OPEN_BODY" | "CLOSED_BODY";
    vehicleType: "TRAILER" | "TRUCK" | "HYVA";
    numberOfWheels: number;
    offeredAmount: {
      total: number;
      advanceAmount: number;
      dieselAmount: number;
    };
    whenNeeded: "IMMEDIATE" | "SCHEDULED";
    scheduleDate?: string;
    isActive: boolean;
    expiresAt: string;
    transporterId: {
      _id: string;
      name: string;
      mobile: {
        countryCode: string;
        phone: string;
      };
      companyName?: string;
      companyLocation?: string;
    };
    bids: Array<{
      _id: string;
      bidBy: {
        _id: string;
        name: string;
        mobile: {
          countryCode: string;
          phone: string;
        };
        companyName?: string;
      };
      status: string;
      biddedAmount: {
        total: number;
        advanceAmount: number;
        dieselAmount: number;
      };
      createdAt: string;
      updatedAt: string;
      rejectionReason?: string;
      rejectionNote?: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

interface UpdateResponse {
  success: boolean;
  message: string;
  load: LoadResponse["load"];
}

const materialTypes = [
  "IRON SHEET",
  "INDUSTRIAL EQUIPMENT",
  "CEMENT",
  "COAL",
  "STEEL",
  "IRON BARS",
  "PIPES",
  "METALS",
  "SCRAPS",
  "OIL",
  "RUBBER",
  "WOOD",
  "VEHICLE PARTS",
  "LEATHER",
  "WHEAT",
  "VEGETABLES",
  "COTTON",
  "TEXTILES",
  "RICE",
  "SPICES",
  "PACKAGED FOOD",
  "MEDICINES",
  "OTHERS",
];

export default function EditLoadPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialType: "",
      weight: 0,
      source: {
        placeName: "",
        coordinates: [0, 0],
      },
      destination: {
        placeName: "",
        coordinates: [0, 0],
      },
      vehicleBodyType: "OPEN_BODY",
      vehicleType: "TRUCK",
      numberOfWheels: 6,
      offeredAmount: {
        total: 0,
        advanceAmount: 0,
        dieselAmount: 0,
      },
      whenNeeded: "IMMEDIATE",
      isActive: true,
      expiresAt: new Date(),
    },
  });

  // Fetch load data
  useEffect(() => {
    const fetchLoad = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<LoadResponse>(`/admin/loads/${params.id}`);

        if (data.success && data.load) {
          const load = data.load;

          // Format the dates
          const scheduleDate = load.scheduleDate
            ? new Date(load.scheduleDate)
            : undefined;
          const expiresAt = load.expiresAt
            ? new Date(load.expiresAt)
            : new Date();

          // Set form values
          form.reset({
            materialType: load.materialType,
            weight: load.weight,
            source: {
              placeName: load.source.placeName,
              coordinates: load.source.coordinates,
            },
            destination: {
              placeName: load.destination.placeName,
              coordinates: load.destination.coordinates,
            },
            vehicleBodyType: load.vehicleBodyType,
            vehicleType: load.vehicleType,
            numberOfWheels: load.numberOfWheels,
            offeredAmount: {
              total: load.offeredAmount.total,
              advanceAmount: load.offeredAmount.advanceAmount,
              dieselAmount: load.offeredAmount.dieselAmount,
            },
            whenNeeded: load.whenNeeded,
            scheduleDate,
            isActive: load.isActive,
            expiresAt,
          });
        }
      } catch (error) {
        console.error("Error fetching load:", error);
        if (error instanceof ApiError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch load details",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchLoad();
    }
  }, [params.id, form, toast]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      // Format the data for API
      const formattedData = {
        ...values,
        // Always include scheduleDate, even for IMMEDIATE loads
        scheduleDate:
          values.scheduleDate?.toISOString() || new Date().toISOString(),
        expiresAt: values.expiresAt.toISOString(),
      };

      // Send update request
      const response = await fetcher<UpdateResponse>(
        `/admin/loads/${params.id}`,
        {
          method: "PUT",
          body: JSON.stringify(formattedData),
        }
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Load updated successfully",
        });

        // Redirect back to load details page
        router.push(`/dashboard/loads/${params.id}`);
      }
    } catch (error) {
      console.error("Error updating load:", error);
      if (error instanceof ApiError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update load",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Load</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the basic details of the load
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="materialType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select material type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materialTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (in tons)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="source.placeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination.placeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Requirements</CardTitle>
              <CardDescription>
                Update the vehicle requirements for this load
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="vehicleBodyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Body Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select body type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OPEN_BODY">Open Body</SelectItem>
                          <SelectItem value="CLOSED_BODY">
                            Closed Body
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TRAILER">Trailer</SelectItem>
                          <SelectItem value="TRUCK">Truck</SelectItem>
                          <SelectItem value="HYVA">Hyva</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfWheels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Wheels</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of wheels" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[4, 6, 8, 10, 12, 14, 16, 18, 22].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} wheels
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Update the payment information for this load
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="offeredAmount.total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="offeredAmount.advanceAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="offeredAmount.dieselAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diesel Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduling & Status</CardTitle>
              <CardDescription>
                Update the scheduling and status information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="whenNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When Needed</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select when needed" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IMMEDIATE">Immediate</SelectItem>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("whenNeeded") === "SCHEDULED" && (
                  <FormField
                    control={form.control}
                    name="scheduleDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Schedule Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <FormDescription>
                          Set whether this load is active or inactive
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
