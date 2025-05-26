import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
	Camera,
	LayoutDashboard,
	MessageSquare,
	Star,
	Tag,
	LogOut,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
	const [location] = useLocation();
	const { logoutMutation } = useAuth();
	const [collapsed, setCollapsed] = useState(false);

	const navItems = [
		{
			title: 'Dashboard',
			icon: <LayoutDashboard className="h-5 w-5" />,
			href: '/admin',
		},
		{
			title: 'Photos',
			icon: <Camera className="h-5 w-5" />,
			href: '/admin/photos',
		},
		{
			title: 'Categories',
			icon: <Tag className="h-5 w-5" />,
			href: '/admin/categories',
		},
		{
			title: 'Testimonials',
			icon: <Star className="h-5 w-5" />,
			href: '/admin/testimonials',
		},
		{
			title: 'Messages',
			icon: <MessageSquare className="h-5 w-5" />,
			href: '/admin/messages',
		},
	];

	const isActive = (path: string) => {
		if (path === '/admin' && location === '/admin') return true;
		if (path !== '/admin' && location.startsWith(path)) return true;
		return false;
	};

	return (
		<div
			className={cn(
				'flex flex-col h-screen bg-primary text-primary-foreground transition-all duration-300',
				collapsed ? 'w-20' : 'w-64',
			)}
		>
			<div className="p-4 border-b border-primary-foreground/10 flex justify-between items-center">
				<div
					className={cn(
						'flex items-center',
						collapsed && 'justify-center w-full',
					)}
				>
					<Link href="/">
						<span className="font-poppins font-semibold text-xl cursor-pointer">
							{collapsed ? 'FD' : 'FotoDS'}
						</span>
					</Link>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setCollapsed(!collapsed)}
					className="text-primary-foreground hover:bg-primary-foreground/10"
				>
					{collapsed ? (
						<ChevronRight className="h-5 w-5" />
					) : (
						<ChevronLeft className="h-5 w-5" />
					)}
				</Button>
			</div>

			<nav className="flex-1 py-6 px-3">
				<ul className="space-y-1">
					{navItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									'flex items-center py-2 px-3 rounded-md transition-colors',
									isActive(item.href)
										? 'bg-primary-foreground/10 text-primary-foreground'
										: 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5',
									collapsed && 'justify-center',
								)}
							>
								{item.icon}
								{!collapsed && (
									<span className="ml-3">{item.title}</span>
								)}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			<div className="p-4 border-t border-primary-foreground/10">
				<Button
					variant="ghost"
					onClick={() => logoutMutation.mutate()}
					className={cn(
						'w-full flex items-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5',
						collapsed && 'justify-center',
					)}
				>
					<LogOut className="h-5 w-5" />
					{!collapsed && <span className="ml-3">Logout</span>}
				</Button>
			</div>
		</div>
	);
}
