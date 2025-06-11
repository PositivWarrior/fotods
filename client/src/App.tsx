import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/lib/protected-route';
import { Helmet } from 'react-helmet';
import { lazy, Suspense } from 'react';

// Lazy load page components
const HomePage = lazy(() => import('@/pages/home-page'));
const PortfolioPage = lazy(() => import('@/pages/portfolio-page'));
const AboutPage = lazy(() => import('@/pages/about-page'));
const ContactPage = lazy(() => import('@/pages/contact-page'));
const AuthPage = lazy(() => import('@/pages/auth-page'));
const PriserPage = lazy(() => import('@/pages/priser-page'));
const AdminDashboard = lazy(() => import('@/pages/admin/dashboard'));
const AdminPhotos = lazy(() => import('@/pages/admin/photos'));
const AdminCategories = lazy(() => import('@/pages/admin/categories'));
const AdminTestimonials = lazy(() => import('@/pages/admin/testimonials'));
const AdminMessages = lazy(() => import('@/pages/admin/messages'));
const NotFound = lazy(() => import('@/pages/not-found'));

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
			<Route path="/admin">
				<ProtectedRoute component={AdminDashboard} adminOnly={true} />
			</Route>
			<Route path="/admin/photos">
				<ProtectedRoute component={AdminPhotos} adminOnly={true} />
			</Route>
			<Route path="/admin/categories">
				<ProtectedRoute component={AdminCategories} adminOnly={true} />
			</Route>
			<Route path="/admin/testimonials">
				<ProtectedRoute
					component={AdminTestimonials}
					adminOnly={true}
				/>
			</Route>
			<Route path="/admin/messages">
				<ProtectedRoute component={AdminMessages} adminOnly={true} />
			</Route>

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
							FotoDS | Dawid Siedlec - Bolig- og eiendomsfotograf
						</title>
						<meta
							name="description"
							content="Profesjonell bolig- og eiendomsfotograf Dawid Siedlec."
						/>
					</Helmet>
					<Toaster />
					<Suspense fallback={<div>Loading...</div>}>
						<Router />
					</Suspense>
				</TooltipProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
console.log('Auto-deployment test: Wed, Jun 11, 2025 11:03:24 AM');
