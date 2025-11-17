import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, ArrowLeft, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  generateTemplate,
  parseFile,
  bulkUploadActivities,
  bulkUploadCategories,
  bulkUploadActivityTypes,
  bulkUploadProducts,
  BulkUploadResult,
} from '@/lib/adminUtils';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);

  // Security: Check admin access
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      toast.error('You must be logged in to access the admin panel');
      navigate('/');
      return;
    }
    
    if (!isAdmin) {
      toast.error('You do not have permission to access the admin panel');
      navigate('/');
      return;
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Show loading or access denied
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <ShieldAlert className="h-6 w-6" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access this page. Only administrators can access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'activity' | 'category' | 'activity_type' | 'product'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const data = await parseFile(file);
      
      if (data.length === 0) {
        toast.error('No data found in file');
        setUploading(false);
        return;
      }

      let result: BulkUploadResult;
      
      switch (type) {
        case 'activity':
          result = await bulkUploadActivities(data);
          break;
        case 'category':
          result = await bulkUploadCategories(data);
          break;
        case 'activity_type':
          result = await bulkUploadActivityTypes(data);
          break;
        case 'product':
          result = await bulkUploadProducts(data);
          break;
      }

      setUploadResult(result);
      
      if (result.success > 0) {
        toast.success(`Successfully uploaded ${result.success} records`);
      }
      
      if (result.failed > 0) {
        toast.error(`Failed to upload ${result.failed} records`);
      }
    } catch (error) {
      const err = error as Error;
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDownloadTemplate = (type: 'activity' | 'category' | 'activity_type' | 'product') => {
    try {
      generateTemplate(type);
      toast.success('Template downloaded successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(`Failed to download template: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-lg text-gray-600">
            Upload Excel or CSV files to bulk import data into the database
          </p>
        </div>

        {/* Upload Result Alert */}
        {uploadResult && (
          <Alert className={`mb-6 ${uploadResult.failed > 0 ? 'border-red-500' : 'border-green-500'}`}>
            <AlertDescription>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Success: {uploadResult.success} records</span>
                  </div>
                  {uploadResult.failed > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold">Failed: {uploadResult.failed} records</span>
                    </div>
                  )}
                  {uploadResult.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        View errors ({uploadResult.errors.length})
                      </summary>
                      <div className="mt-2 p-3 bg-red-50 rounded text-xs max-h-40 overflow-y-auto">
                        {uploadResult.errors.map((error, idx) => (
                          <div key={idx} className="mb-1 text-red-800">
                            {error}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs for different data types */}
        <Tabs defaultValue="product" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Activities</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="activity_type">Activity Types</TabsTrigger>
            <TabsTrigger value="product">Products</TabsTrigger>
          </TabsList>

          {/* Activities Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Upload Activities</CardTitle>
                <CardDescription>
                  Upload activity themes (e.g., "Keşfet & Eğlen", "Spor & Macera")
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadTemplate('activity')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <label className="flex-1">
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload File'}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleFileUpload(e, 'activity')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-1">Required columns:</p>
                  <ul className="list-disc list-inside">
                    <li>activity_name</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="category">
            <Card>
              <CardHeader>
                <CardTitle>Upload Categories</CardTitle>
                <CardDescription>
                  Upload categories under activity themes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadTemplate('category')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <label className="flex-1">
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload File'}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleFileUpload(e, 'category')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-1">Required columns:</p>
                  <ul className="list-disc list-inside">
                    <li>activity_id (UUID from activities table)</li>
                    <li>category_name</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Types Tab */}
          <TabsContent value="activity_type">
            <Card>
              <CardHeader>
                <CardTitle>Upload Activity Types</CardTitle>
                <CardDescription>
                  Upload specific activity types under categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadTemplate('activity_type')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <label className="flex-1">
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload File'}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleFileUpload(e, 'activity_type')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-1">Required columns:</p>
                  <ul className="list-disc list-inside">
                    <li>activity_id (UUID from activities table)</li>
                    <li>category_id (UUID from categories table)</li>
                    <li>activity_type_name</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="product">
            <Card>
              <CardHeader>
                <CardTitle>Upload Products</CardTitle>
                <CardDescription>
                  Upload experience products with details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadTemplate('product')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <label className="flex-1">
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload File'}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleFileUpload(e, 'product')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-1">Required columns:</p>
                  <ul className="list-disc list-inside">
                    <li>category_id (UUID from categories table)</li>
                    <li>title</li>
                  </ul>
                  <p className="font-semibold mt-2 mb-1">Optional columns:</p>
                  <ul className="list-disc list-inside text-xs">
                    <li>activity_type_id, sub_title, description, price, image_url</li>
                    <li>external_url, city, district, ticket_rule, date, rating, is_active</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-semibold mb-1">1. Download Template</p>
              <p>Click "Download Template" to get an Excel file with the correct structure and sample data.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">2. Fill in Your Data</p>
              <p>Open the template in Excel or Google Sheets and fill in your data. Follow the column names exactly.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">3. Upload File</p>
              <p>Click "Upload File" and select your completed Excel or CSV file. The system will validate and import your data.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">4. Check Results</p>
              <p>After upload, you'll see a summary of successful and failed records. Click "View errors" to see details of any failures.</p>
            </div>
            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="font-semibold text-amber-800">⚠️ Important Notes:</p>
              <ul className="list-disc list-inside mt-1 text-amber-700">
                <li>Upload activities first, then categories, then activity types, then products</li>
                <li>Use the UUIDs from previously uploaded records for foreign key references</li>
                <li>Supported file formats: .xlsx, .xls, .csv</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}