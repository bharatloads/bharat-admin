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
  truckNumber: z.string().min(1, "Truck number is required"),
  truckLocation: z.object({
    placeName: z.string().min(1, "Location is required"),
    coordinates: z.array(z.number()).length(2),
  }),
  truckCapacity: z.coerce.number().positive(),
  vehicleBodyType: z.enum(["OPEN_BODY", "CLOSED_BODY"]),
  truckBodyType: z.string(),
  truckType: z.string(),
  truckTyre: z.coerce.number().positive(),
  isActive: z.boolean(),
  expiresAt: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

// Define API response types
interface TruckResponse {
  success: boolean;
  truck: {
    _id: string;
    truckNumber: string;
    truckLocation: {
      placeName: string;
      coordinates: number[];
      type: string;
    };
    truckCapacity: number;
    vehicleBodyType: "OPEN_BODY" | "CLOSED_BODY";
    truckBodyType: string;
    truckType: string;
    truckTyre: number;
    isActive: boolean;
    expiresAt: string;
    isRCVerified: boolean;
    RCVerificationStatus: string;
    RCImage: string;
    truckOwner: {
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
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

interface UpdateResponse {
  success: boolean;
  message: string;
  truck: TruckResponse["truck"];
}

export default function EditTruckPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truckNumber: "",
      truckLocation: {
        placeName: "",
        coordinates: [0, 0],
      },
      truckCapacity: 0,
      vehicleBodyType: "OPEN_BODY",
      truckBodyType: "",
      truckType: "",
      truckTyre: 0,
      isActive: true,
      expiresAt: new Date(),
    },
  });

  // Fetch truck data
  useEffect(() => {
    const fetchTruck = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<TruckResponse>(`/admin/trucks/${params.id}`);

        if (data.success && data.truck) {
          const truck = data.truck;

          // Format the dates
          const expiresAt = truck.expiresAt
            ? new Date(truck.expiresAt)
            : new Date();

          // Set form values
          form.reset({
            truckNumber: truck.truckNumber,
            truckLocation: {
              placeName: truck.truckLocation.placeName,
              coordinates: truck.truckLocation.coordinates,
            },
            truckCapacity: truck.truckCapacity,
            vehicleBodyType: truck.vehicleBodyType,
            truckBodyType: truck.truckBodyType,
            truckType: truck.truckType,
            truckTyre: truck.truckTyre,
            isActive: truck.isActive,
            expiresAt,
          });
        }
      } catch (error) {
        console.error("Error fetching truck:", error);
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
            description: "Failed to fetch truck details",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTruck();
    }
  }, [params.id, form, toast]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      // Format the data for API
      const formattedData = {
        ...values,
        expiresAt: values.expiresAt.toISOString(),
      };

      // Send update request
      const response = await fetcher<UpdateResponse>(
        `/admin/trucks/${params.id}`,
        {
          method: "PUT",
          body: JSON.stringify(formattedData),
        }
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Truck updated successfully",
        });

        // Redirect back to truck details page
        router.push(`/dashboard/trucks/${params.id}`);
      }
    } catch (error) {
      console.error("Error updating truck:", error);
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
          description: "Failed to update truck",
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
        <h1 className="text-2xl font-bold">Edit Truck</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the basic details of the truck
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="truckNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truck Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="truckCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (in tons)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="truckLocation.placeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Truck Specifications</CardTitle>
              <CardDescription>
                Update the specifications of the truck
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  name="truckBodyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truck Body Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="truckType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truck Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="truckTyre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Tyres</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of tyres" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[4, 6, 8, 10, 12, 14, 16, 18, 22].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} tyres
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
              <CardTitle>Status & Expiry</CardTitle>
              <CardDescription>
                Update the status and expiry information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          Set whether this truck is active or inactive
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
