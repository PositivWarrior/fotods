import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Category, Photo, ContactMessage, Testimonial } from "@shared/schema";
import { Link } from "wouter";
import { Camera, Tag, MessageSquare, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Fetch data for dashboard
  const { data: photos, isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });
  
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: messages, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
  });
  
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });
  
  // Calculate unread messages
  const unreadMessages = messages?.filter(message => !message.read).length || 0;
  
  const stats = [
    {
      title: "Total Photos",
      value: photosLoading ? null : photos?.length || 0,
      icon: <Camera className="h-6 w-6" />,
      href: "/admin/photos",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Categories",
      value: categoriesLoading ? null : categories?.length || 0,
      icon: <Tag className="h-6 w-6" />,
      href: "/admin/categories",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Unread Messages",
      value: messagesLoading ? null : unreadMessages,
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/admin/messages",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Testimonials",
      value: testimonialsLoading ? null : testimonials?.length || 0,
      icon: <Star className="h-6 w-6" />,
      href: "/admin/testimonials",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Welcome, {user?.username}</h2>
        <p className="text-muted-foreground">
          Manage your photography portfolio from this dashboard.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {stat.value !== null ? stat.value : <Skeleton className="h-8 w-16" />}
              </div>
              <Link href={stat.href}>
                <Button variant="link" className="p-0 h-auto font-normal">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messagesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b pb-3">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="border-b pb-3 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="font-medium">{message.name}</div>
                      {!message.read && (
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {message.message}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <Link href="/admin/messages">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Messages
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground">No messages yet.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {photosLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex border-b pb-3">
                    <Skeleton className="h-16 w-16 rounded mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : photos && photos.length > 0 ? (
              <div className="space-y-4">
                {photos.slice(0, 5).map((photo) => (
                  <div key={photo.id} className="flex items-center border-b pb-3 last:border-0">
                    <div className="h-16 w-16 bg-muted rounded overflow-hidden mr-4">
                      <img 
                        src={photo.thumbnailUrl} 
                        alt={photo.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{photo.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {photo.location || 'No location'}
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/admin/photos">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Photos
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground">No photos added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
