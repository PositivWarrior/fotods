import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/use-auth';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/home-page';
import PortfolioPage from '@/pages/portfolio-page';
import AboutPage from '@/pages/about-page';
import ContactPage from '@/pages/contact-page';
import AuthPage from '@/pages/auth-page';
import PriserPage from '@/pages/priser-page';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminPhotos from '@/pages/admin/photos';
import AdminCategories from '@/pages/admin/categories';
import AdminTestimonials from '@/pages/admin/testimonials';
import AdminMessages from '@/pages/admin/messages';
import { ProtectedRoute } from '@/lib/protected-route';
import { Helmet } from 'react-helmet';

function Router() {
	return (
		<Switch>
			<Route path="/" component={HomePage} />
			<Route path="/portfolio" component={PortfolioPage} />
			<Route
				path="/portfolio/category/:category"
				component={PortfolioPage}
			/>
			<Route path="/portfolio/:category" component={PortfolioPage} />
			<Route path="/about" component={AboutPage} />
			<Route path="/priser" component={PriserPage} />
			<Route path="/contact" component={ContactPage} />
			<Route path="/auth" component={AuthPage} />

			{/* Admin Routes - Protected */}
			<ProtectedRoute path="/admin" component={AdminDashboard} />
			<ProtectedRoute path="/admin/photos" component={AdminPhotos} />
			<ProtectedRoute
				path="/admin/categories"
				component={AdminCategories}
			/>
			<ProtectedRoute
				path="/admin/testimonials"
				component={AdminTestimonials}
			/>
			<ProtectedRoute path="/admin/messages" component={AdminMessages} />

			{/* Fallback to 404 */}
			<Route component={NotFound} />
		</Switch>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<TooltipProvider>
					<Helmet>
						<title>
							FotoDS | Dawid Siedlec - Interior Photography
						</title>
						<meta
							name="description"
							content="Professional interior and architectural photography by Dawid Siedlec."
						/>
					</Helmet>
					<Toaster />
					<Router />
				</TooltipProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
