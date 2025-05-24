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

export function ImageUpload() {
	const { toast } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const thumbnailInputRef = useRef<HTMLInputElement>(null);

	const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [thumbnailUrl, setThumbnailUrl] = useState('');
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
	const [uploading, setUploading] = useState(false);

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

			// Check file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				toast({
					title: 'File too large',
					description: 'Maximum file size is 10MB',
					variant: 'destructive',
				});
				return;
			}

			setMainImageFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onload = () => {
				setMainImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// File upload handler for thumbnail
	const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			// Check file size (max 5MB for thumbnails)
			if (file.size > 5 * 1024 * 1024) {
				toast({
					title: 'File too large',
					description: 'Maximum thumbnail file size is 5MB',
					variant: 'destructive',
				});
				return;
			}

			setThumbnailFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onload = () => {
				setThumbnailPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Upload files to server using our file upload API
	const uploadFiles = async () => {
		setUploading(true);

		try {
			// Create form data for file upload
			const formData = new FormData();

			// Add main image file
			if (mainImageFile) {
				formData.append('mainImage', mainImageFile);
			}

			// Add thumbnail image file if available
			if (thumbnailFile) {
				formData.append('thumbnailImage', thumbnailFile);
			}

			// Send files to server
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
				credentials: 'include', // Include cookies for auth
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Upload failed');
			}

			// Get URLs from server response
			const { imageUrl, thumbnailUrl } = await response.json();

			setUploading(false);
			return {
				fullImageUrl: imageUrl,
				thumbUrl: thumbnailUrl,
			};
		} catch (error) {
			setUploading(false);
			throw error;
		}
	};

	// Create a new photo
	const { mutate: createPhoto, isPending } = useMutation({
		mutationFn: async (photoData: InsertPhoto) => {
			const res = await apiRequest('POST', '/api/photos', photoData);
			return res.json();
		},
		onSuccess: () => {
			// Reset form and invalidate photos query
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
				title: 'Error',
				description: `Failed to upload photo: ${error.message}`,
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

		// Reset file inputs
		if (fileInputRef.current) fileInputRef.current.value = '';
		if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic validation
		if (!title || !categoryId) {
			return toast({
				title: 'Missing information',
				description: 'Please fill in all required fields',
				variant: 'destructive',
			});
		}

		// URL method validation
		if (uploadMethod === 'url' && (!imageUrl || !thumbnailUrl)) {
			return toast({
				title: 'Missing URLs',
				description: 'Please provide both full size and thumbnail URLs',
				variant: 'destructive',
			});
		}

		// File method validation
		if (uploadMethod === 'file' && !mainImageFile) {
			return toast({
				title: 'Missing image',
				description: 'Please upload a full size image',
				variant: 'destructive',
			});
		}

		try {
			let finalImageUrl = imageUrl;
			let finalThumbnailUrl = thumbnailUrl;

			// If using file upload method, process the files first
			if (uploadMethod === 'file') {
				const { fullImageUrl, thumbUrl } = await uploadFiles();
				finalImageUrl = fullImageUrl!;
				finalThumbnailUrl = thumbUrl!;
			}

			// Converting categoryId to number
			createPhoto({
				title,
				description,
				imageUrl: finalImageUrl,
				thumbnailUrl: finalThumbnailUrl,
				categoryId: parseInt(categoryId),
				featured,
			});
		} catch (error) {
			toast({
				title: 'Upload error',
				description:
					error instanceof Error
						? error.message
						: 'Unknown error occurred',
				variant: 'destructive',
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add New Photo</CardTitle>
				<CardDescription>
					Add new photos to your portfolio
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
										required={uploadMethod === 'file'}
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
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="imageUrl">
										Full Size Image URL *
									</Label>
									<Input
										id="imageUrl"
										value={imageUrl}
										onChange={(e) =>
											setImageUrl(e.target.value)
										}
										placeholder="https://example.com/full-image.jpg"
										required={uploadMethod === 'url'}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="thumbnailUrl">
										Thumbnail Image URL *
									</Label>
									<Input
										id="thumbnailUrl"
										value={thumbnailUrl}
										onChange={(e) =>
											setThumbnailUrl(e.target.value)
										}
										placeholder="https://example.com/thumbnail.jpg"
										required={uploadMethod === 'url'}
									/>
								</div>
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
						disabled={isPending || uploading}
						className="w-full"
					>
						{isPending || uploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{uploading
									? 'Uploading files...'
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
