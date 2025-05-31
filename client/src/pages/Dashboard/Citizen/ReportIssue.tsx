import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload } from 'lucide-react';
import { issuesAPI } from '@/lib/api';
import IssueMap from '@/components/Map/IssueMap';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Roads & Transportation',
    'Water & Utilities',
    'Parks & Recreation',
    'Public Safety',
    'Waste Management',
    'Lighting',
    'Noise Issues',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);

      if (imageFile) {
        payload.append('images', imageFile); // your backend supports multiple images
      }

      await issuesAPI.create(payload); // implement with fetch/Axios

      toast({
        title: "Issue reported successfully",
        description: "Your report has been submitted to city officials.",
      });

      setFormData({ title: '', description: '', category: '' });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
        <p className="text-gray-600">Help us improve your community by reporting problems you encounter</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Photo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                {imageFile ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Issue preview"
                      className="mx-auto h-32 w-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600">{imageFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setImageFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Upload a photo to help us understand the issue better
                    </p>
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Camera className="h-4 w-4 mr-2" />
                          Choose Photo
                        </span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your report will be reviewed by our team</li>
            <li>• We'll assign it to the appropriate department</li>
            <li>• You'll receive updates on the progress</li>
            <li>• Typical response time is 24–48 hours</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIssue;
