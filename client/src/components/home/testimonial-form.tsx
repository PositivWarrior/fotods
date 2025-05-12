import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertTestimonial } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Testimonial submission schema - active defaults to false for moderation
const testimonialSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Please provide your position or company.",
  }),
  content: z.string().min(10, {
    message: "Testimonial must be at least 10 characters.",
  }).max(500, {
    message: "Testimonial must not exceed 500 characters."
  }),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export function TestimonialForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [charCount, setCharCount] = useState(0);
  
  // Define form
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      content: ""
    },
  });

  // Handle testimonial submission
  const mutation = useMutation({
    mutationFn: async (data: TestimonialFormValues) => {
      // Set isActive to false for moderation and add a default rating of 5
      const testimonialData: InsertTestimonial = {
        ...data,
        rating: 5,
        isActive: false
      };
      
      const res = await apiRequest("POST", "/api/testimonials", testimonialData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your testimonial!",
        description: "Your testimonial has been submitted for review.",
      });
      
      // Reset form
      form.reset();
      setCharCount(0);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(data: TestimonialFormValues) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role / Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Interior Designer at Studio X" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Testimonial</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your experience working with FotoDS..." 
                  className="resize-none min-h-[100px]" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    setCharCount(e.target.value.length);
                  }}
                />
              </FormControl>
              <FormDescription className="flex justify-end text-xs">
                {charCount}/500 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Testimonial"
          )}
        </Button>
      </form>
    </Form>
  );
}