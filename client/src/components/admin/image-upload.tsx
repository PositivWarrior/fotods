import { useState, useRef, ChangeEvent } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Category, InsertPhoto } from '@shared/schema';
import { Loader2, UploadCloud, Link as LinkIcon, Image } from 'lucide-react';

// Upload function that uses backend endpoint
async function uploadFileViaBackend(form: FormData) {
	const res = await fetch(
		`${import.meta.env.VITE_API_URL || ''}/api/upload`,
		{
			method: 'POST',
			credentials: 'include', // Include cookies for authorization
			body: form,
		},
	);
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || 'Upload failed');
	}
	return res.json() as Promise<{ imageUrl: string; thumbnailUrl: string }>;
}

export function ImageUpload() {
	const { toast } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const thumbnailInputRef = useRef<HTMLInputElement>(null);

	const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [imageUrl, setImageUrl] = useState(''); // For URL input method
	const [thumbnailUrl, setThumbnailUrl] = useState(''); // For URL input method
	const [categoryId, setCategoryId] = useState<string>('');
	const [featured, setFeatured] = useState(false);

	// For file uploads
	const [mainImageFile, setMainImageFile] = useState<File | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [mainImagePreview, setMainImagePreview] = useState<string | null>(
		null,
	);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
		null,
	);
	const [uploading, setUploading] = useState(false); // For backend upload status

	// Fetch categories for the dropdown
	const { data: categories, isLoading: categoriesLoading } = useQuery<
		Category[]
	>({
		queryKey: ['/api/categories'],
	});

	// File upload handler for main image
	const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.size > 10 * 1024 * 1024) {
				// Max 10MB
				toast({
					title: 'File too large',
					description: 'Maximum file size is 10MB',
					variant: 'destructive',
				});
				return;
			}
			setMainImageFile(file);
			const reader = new FileReader();
			reader.onload = () => setMainImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	// File upload handler for thumbnail
	const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.size > 5 * 1024 * 1024) {
				// Max 5MB for thumbnails
				toast({
					title: 'File too large',
					description: 'Maximum thumbnail file size is 5MB',
					variant: 'destructive',
				});
				return;
			}
			setThumbnailFile(file);
			const reader = new FileReader();
			reader.onload = () => setThumbnailPreview(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	// Create a new photo (metadata goes to our backend)
	const { mutate: createPhoto, isPending: isCreatingPhoto } = useMutation({
		mutationFn: async (photoData: InsertPhoto) => {
			const res = await apiRequest('POST', '/api/photos', photoData);
			return res.json();
		},
		onSuccess: () => {
			resetForm();
			queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
			queryClient.invalidateQueries({
				queryKey: ['/api/photos/featured'],
			});
			toast({
				title: 'Success',
				description: 'Photo has been added to the portfolio',
			});
		},
		onError: (error: Error) => {
			toast({
				title: 'Error Adding Photo Metadata',
				description: `Failed to save photo details: ${error.message}`,
				variant: 'destructive',
			});
		},
	});

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setImageUrl('');
		setThumbnailUrl('');
		setCategoryId('');
		setFeatured(false);
		setMainImageFile(null);
		setThumbnailFile(null);
		setMainImagePreview(null);
		setThumbnailPreview(null);
		setUploading(false);
		if (fileInputRef.current) fileInputRef.current.value = '';
		if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !categoryId) {
			toast({
				title: 'Missing information',
				description: 'Please fill in title and category',
				variant: 'destructive',
			});
			return;
		}

		let finalImageUrl = imageUrl; // Use URL input if provided
		let finalThumbnailUrl = thumbnailUrl; // Use URL input if provided

		if (uploadMethod === 'file') {
			if (!mainImageFile) {
				toast({
					title: 'Missing image file',
					description: 'Please upload a full size image',
					variant: 'destructive',
				});
				return;
			}

			setUploading(true);
			try {
				// Prepare FormData for backend upload
				const form = new FormData();
				form.append('mainImage', mainImageFile);
				if (thumbnailFile) {
					form.append('thumbnailImage', thumbnailFile);
				}

				// Upload via backend
				const {
					imageUrl: uploadedImageUrl,
					thumbnailUrl: uploadedThumbnailUrl,
				} = await uploadFileViaBackend(form);

				finalImageUrl = uploadedImageUrl;
				finalThumbnailUrl = uploadedThumbnailUrl;
			} catch (error: any) {
				toast({
					title: 'File Upload Error',
					description:
						error.message ||
						'An unknown error occurred during file upload.',
					variant: 'destructive',
				});
				setUploading(false);
				return;
			}
			setUploading(false);
		} else {
			// URL method
			if (!imageUrl || !thumbnailUrl) {
				toast({
					title: 'Missing URLs',
					description:
						'Please provide both full size and thumbnail URLs for the URL method.',
					variant: 'destructive',
				});
				return;
			}
			finalImageUrl = imageUrl;
			finalThumbnailUrl = thumbnailUrl;
		}

		// Safety check for final URLs
		if (!finalImageUrl || !finalThumbnailUrl) {
			toast({
				title: 'Image URLs missing',
				description:
					'Could not determine image URLs after processing. Please try again.',
				variant: 'destructive',
			});
			return;
		}

		createPhoto({
			title,
			description,
			imageUrl: finalImageUrl,
			thumbnailUrl: finalThumbnailUrl,
			categoryId: parseInt(categoryId, 10),
			featured,
		});
	};

	// State for URL input method
	const [imageUrlFromUrlInput, setImageUrlFromUrlInput] = useState('');
	const [thumbnailUrlFromUrlInput, setThumbnailUrlFromUrlInput] =
		useState('');

	return (
		<Card className="my-6">
			<CardHeader>
				<CardTitle>Add New Photo</CardTitle>
				<CardDescription>
					Add new photos to your portfolio. Use file upload or provide
					direct URLs.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs
					defaultValue="file"
					value={uploadMethod}
					onValueChange={(value) =>
						setUploadMethod(value as 'url' | 'file')
					}
					className="mb-6"
				>
					<TabsList className="grid grid-cols-2 w-full">
						<TabsTrigger value="file" className="flex items-center">
							<UploadCloud className="mr-2 h-4 w-4" />
							File Upload
						</TabsTrigger>
						<TabsTrigger value="url" className="flex items-center">
							<LinkIcon className="mr-2 h-4 w-4" />
							URL Input
						</TabsTrigger>
					</TabsList>

					<TabsContent value="file">
						<div className="space-y-6 mt-4">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-3">
									<Label htmlFor="mainImage">
										Full Size Image *
									</Label>
									{mainImagePreview ? (
										<div className="relative group">
											<img
												src={mainImagePreview}
												alt="Full size preview"
												className="w-full h-48 object-cover rounded-md border border-gray-200"
											/>
											<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
												<Button
													type="button"
													variant="secondary"
													size="sm"
													onClick={() => {
														setMainImageFile(null);
														setMainImagePreview(
															null,
														);
														if (
															fileInputRef.current
														)
															fileInputRef.current.value =
																'';
													}}
												>
													Change Image
												</Button>
											</div>
										</div>
									) : (
										<div
											className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
											onClick={() =>
												fileInputRef.current?.click()
											}
										>
											<Image className="h-10 w-10 text-gray-400 mb-2" />
											<p className="text-sm text-gray-500">
												Click to upload full size image
											</p>
											<p className="text-xs text-gray-400 mt-1">
												JPG, PNG or WEBP (max 10MB)
											</p>
										</div>
									)}
									<Input
										ref={fileInputRef}
										id="mainImage"
										type="file"
										accept="image/png, image/jpeg, image/webp"
										className="hidden"
										onChange={handleMainImageChange}
									/>
								</div>

								<div className="space-y-3">
									<Label htmlFor="thumbnailImage">
										Thumbnail Image{' '}
										<span className="text-gray-400 text-xs">
											(Optional)
										</span>
									</Label>
									{thumbnailPreview ? (
										<div className="relative group">
											<img
												src={thumbnailPreview}
												alt="Thumbnail preview"
												className="w-full h-48 object-cover rounded-md border border-gray-200"
											/>
											<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
												<Button
													type="button"
													variant="secondary"
													size="sm"
													onClick={() => {
														setThumbnailFile(null);
														setThumbnailPreview(
															null,
														);
														if (
															thumbnailInputRef.current
														)
															thumbnailInputRef.current.value =
																'';
													}}
												>
													Change Image
												</Button>
											</div>
										</div>
									) : (
										<div
											className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
											onClick={() =>
												thumbnailInputRef.current?.click()
											}
										>
											<Image className="h-10 w-10 text-gray-400 mb-2" />
											<p className="text-sm text-gray-500">
												Click to upload thumbnail
											</p>
											<p className="text-xs text-gray-400 mt-1">
												If not provided, full size image
												will be used
											</p>
										</div>
									)}
									<Input
										ref={thumbnailInputRef}
										id="thumbnailImage"
										type="file"
										accept="image/png, image/jpeg, image/webp"
										className="hidden"
										onChange={handleThumbnailChange}
									/>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="url">
						<div className="space-y-4 mt-4">
							<div className="space-y-2">
								<Label htmlFor="imageUrlInput">
									Full Size Image URL *
								</Label>
								<Input
									id="imageUrlInput"
									type="url"
									value={imageUrl}
									onChange={(e) =>
										setImageUrl(e.target.value)
									}
									placeholder="https://example.com/image.jpg"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="thumbnailUrlInput">
									Thumbnail Image URL *
								</Label>
								<Input
									id="thumbnailUrlInput"
									type="url"
									value={thumbnailUrl}
									onChange={(e) =>
										setThumbnailUrl(e.target.value)
									}
									placeholder="https://example.com/thumbnail.jpg"
								/>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Photo Title *</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Modern Living Room Design"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="A brief description of the photo..."
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="category">Category *</Label>
						<Select
							value={categoryId}
							onValueChange={setCategoryId}
							required
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{categoriesLoading ? (
									<div className="flex justify-center p-2">
										<Loader2 className="h-5 w-5 animate-spin" />
									</div>
								) : (
									categories?.map((category) => (
										<SelectItem
											key={category.id}
											value={category.id.toString()}
										>
											{category.name}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="featured"
							checked={featured}
							onCheckedChange={(checked) =>
								setFeatured(checked as boolean)
							}
						/>
						<Label htmlFor="featured" className="cursor-pointer">
							Featured photo (shown on homepage)
						</Label>
					</div>

					<Button
						type="submit"
						disabled={isCreatingPhoto || uploading}
						className="w-full"
					>
						{isCreatingPhoto || uploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{uploading
									? 'Uploading files to backend...'
									: 'Saving photo...'}
							</>
						) : (
							'Add Photo'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
