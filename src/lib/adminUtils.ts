import * as XLSX from 'xlsx';
import { supabase, TABLES, isAdmin } from './supabase';
import { toast } from 'sonner';

export interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
}

interface ActivityRow {
  activity_name: string;
}

interface CategoryRow {
  activity_id: string;
  category_name: string;
}

interface ActivityTypeRow {
  activity_id: string;
  category_id: string;
  activity_type_name: string;
}

// Updated: Added priority and full_address fields
interface ProductRow {
  id?: string; // Optional ID for update operations
  activity_type_id?: string;
  category_id: string;
  title: string;
  sub_title?: string;
  description?: string;
  price: number;
  image_url?: string;
  external_url?: string;
  city?: string;
  district?: string;
  ticket_rule?: string;
  date?: string;
  rating?: number;
  is_active?: boolean;
  priority?: number; // New field: priority for sorting
  full_address?: string; // New field: full address for events
}

export const generateTemplate = async (
  type: 'activity' | 'category' | 'activity_type' | 'product'
) => {
  let sampleData: unknown[] = [];

  switch (type) {
    case 'activity':
      sampleData = [
        { activity_name: 'Keşfet & Eğlen' },
        { activity_name: 'Spor & Macera' },
      ];
      break;

    case 'category': {
      // Parent activity names
      const { data: activities } = await supabase
        .from(TABLES.ACTIVITY)
        .select('id, activity_name');

      sampleData = activities && activities.length > 0
        ? activities.map(a => ({
          activity_id: a.id,
          activity_name: a.activity_name, // Parent name
          category_name: 'Tema ve Macera Parkları',
        }))
        : [{ activity_id: 'UUID-of-activity', activity_name: 'Parent Activity', category_name: 'Tema ve Macera Parkları' }];
      break;
    }

    case 'activity_type': {
      // Parent activities and categories
      const { data: categories } = await supabase
        .from(TABLES.CATEGORY)
        .select('id, category_name, activity_id');

      // Fetch activity names for each category
      const activityIds = [...new Set(categories?.map(c => c.activity_id))];
      const { data: activities } = await supabase
        .from(TABLES.ACTIVITY)
        .select('id, activity_name')
        .in('id', activityIds);

      sampleData = categories?.map(c => {
        const parentActivity = activities?.find(a => a.id === c.activity_id);
        return {
          activity_id: c.activity_id,
          activity_name: parentActivity?.activity_name,
          category_id: c.id,
          category_name: c.category_name,
          activity_type_name: 'Tema Park',
        };
      }) || [{ activity_id: 'UUID-of-activity', activity_name: 'Parent Activity', category_id: 'UUID-of-category', category_name: 'Parent Category', activity_type_name: 'Tema Park' }];
      break;
    }

    case 'product': {
      const { data: products } = await supabase
        .from(TABLES.PRODUCT)
        .select('*')
        .limit(100);

      // Fetch parent activity types, categories, and activities
      const activityTypeIds = [...new Set(products?.map(p => p.activity_type_id).filter(Boolean))];
      const { data: activityTypes } = await supabase
        .from(TABLES.ACTIVITY_TYPE)
        .select('id, activity_type_name, category_id')
        .in('id', activityTypeIds);

      const categoryIds = [...new Set(activityTypes?.map(at => at.category_id).concat(products?.map(p => p.category_id)))];
      const { data: categories } = await supabase
        .from(TABLES.CATEGORY)
        .select('id, category_name, activity_id')
        .in('id', categoryIds);

      const activityIds = [...new Set(categories?.map(c => c.activity_id))];
      const { data: activities } = await supabase
        .from(TABLES.ACTIVITY)
        .select('id, activity_name')
        .in('id', activityIds);

      sampleData = products?.map(p => {
        const parentActivityType = activityTypes?.find(at => at.id === p.activity_type_id);
        const parentCategory = categories?.find(c => c.id === p.category_id);
        const parentActivity = activities?.find(a => a.id === parentCategory?.activity_id);

        return {
          id: p.id,
          activity_type_id: p.activity_type_id,
          activity_type_name: parentActivityType?.activity_type_name,
          category_id: p.category_id,
          category_name: parentCategory?.category_name,
          activity_id: parentActivity?.id,
          activity_name: parentActivity?.activity_name,
          title: p.title,
          sub_title: p.sub_title || '',
          description: p.description || '',
          price: p.price,
          image_url: p.image_url || '',
          external_url: p.external_url || '',
          city: p.city || '',
          district: p.district || '',
          ticket_rule: p.ticket_rule || '',
          date: p.date || '',
          rating: p.rating || '',
          is_active: p.is_active,
          priority: p.priority || 0,
          full_address: p.full_address || '',
        };
      }) || [{
        id: '',
        activity_type_id: '',
        activity_type_name: '',
        category_id: '',
        category_name: '',
        activity_id: '',
        activity_name: '',
        title: 'Sample Product',
        sub_title: '',
        description: '',
        price: 0,
        image_url: '',
        external_url: '',
        city: '',
        district: '',
        ticket_rule: '',
        date: '',
        rating: '',
        is_active: true,
        priority: 0,
        full_address: '',
      }];
      break;
    }
  }

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, type);
  XLSX.writeFile(wb, `${type}_template.xlsx`);
};


// Parse Excel/CSV file
export const parseFile = async (file: File): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) {
          reject("Dosya okunamadı");
          return;
        }

        // ✅ CSV dosyası UTF-8 değilse bile TextDecoder ile çöz
        const bytes = new Uint8Array(result as ArrayBuffer);
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const text = decoder.decode(bytes);

        // ✅ Türkçe karakter dönüşümünü manuel olarak da düzelt
        const fixedText = text
          .replace(/Ã§/g, "ç")
          .replace(/Ã‡/g, "Ç")
          .replace(/Ã¶/g, "ö")
          .replace(/Ã–/g, "Ö")
          .replace(/Ã¼/g, "ü")
          .replace(/Ãœ/g, "Ü")
          .replace(/Ã½/g, "ı")
          .replace(/ÃŸ/g, "ß")
          .replace(/Ã°/g, "ğ")
          .replace(/Ã /g, "Ğ")
          .replace(/ÅŸ/g, "ş")
          .replace(/Åž/g, "Ş");

        const workbook = XLSX.read(fixedText, { type: "string" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        resolve(json);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  });
};

// Bulk upload activities
export const bulkUploadActivities = async (data: unknown[]): Promise<BulkUploadResult> => {
  // Security: Check admin access
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    toast.error('You do not have permission to perform this action');
    return { success: 0, failed: 0, errors: ['Access denied: Admin privileges required'] };
  }

  const result: BulkUploadResult = { success: 0, failed: 0, errors: [] };

  for (const item of data) {
    const row = item as ActivityRow;
    try {
      if (!row.activity_name) {
        result.failed++;
        result.errors.push(`Row missing activity_name: ${JSON.stringify(row)}`);
        continue;
      }

      const { error } = await supabase.from(TABLES.ACTIVITY).insert({
        activity_name: row.activity_name,
      });

      if (error) throw error;
      result.success++;
    } catch (error) {
      const err = error as Error;
      result.failed++;
      result.errors.push(`Error inserting ${row.activity_name}: ${err.message}`);
    }
  }

  return result;
};

// Bulk upload categories
export const bulkUploadCategories = async (data: unknown[]): Promise<BulkUploadResult> => {
  // Security: Check admin access
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    toast.error('You do not have permission to perform this action');
    return { success: 0, failed: 0, errors: ['Access denied: Admin privileges required'] };
  }

  const result: BulkUploadResult = { success: 0, failed: 0, errors: [] };

  for (const item of data) {
    const row = item as CategoryRow;
    try {
      if (!row.activity_id || !row.category_name) {
        result.failed++;
        result.errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
        continue;
      }

      const { error } = await supabase.from(TABLES.CATEGORY).insert({
        activity_id: row.activity_id,
        category_name: row.category_name,
      });

      if (error) throw error;
      result.success++;
    } catch (error) {
      const err = error as Error;
      result.failed++;
      result.errors.push(`Error inserting ${row.category_name}: ${err.message}`);
    }
  }

  return result;
};

// Bulk upload activity types
export const bulkUploadActivityTypes = async (data: unknown[]): Promise<BulkUploadResult> => {
  // Security: Check admin access
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    toast.error('You do not have permission to perform this action');
    return { success: 0, failed: 0, errors: ['Access denied: Admin privileges required'] };
  }

  const result: BulkUploadResult = { success: 0, failed: 0, errors: [] };

  for (const item of data) {
    const row = item as ActivityTypeRow;
    try {
      if (!row.activity_id || !row.category_id || !row.activity_type_name) {
        result.failed++;
        result.errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
        continue;
      }

      const { error } = await supabase.from(TABLES.ACTIVITY_TYPE).insert({
        activity_id: row.activity_id,
        category_id: row.category_id,
        activity_type_name: row.activity_type_name,
      });

      if (error) throw error;
      result.success++;
    } catch (error) {
      const err = error as Error;
      result.failed++;
      result.errors.push(`Error inserting ${row.activity_type_name}: ${err.message}`);
    }
  }

  return result;
};

// Updated: Bulk upload products with insert/update logic based on ID presence
export const bulkUploadProducts = async (data: unknown[]): Promise<BulkUploadResult> => {
  // Security: Check admin access
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    toast.error('You do not have permission to perform this action');
    return { success: 0, failed: 0, errors: ['Access denied: Admin privileges required'] };
  }

  const result: BulkUploadResult = { success: 0, failed: 0, errors: [] };

  for (const item of data) {
    const row = item as ProductRow;
    try {
      if (!row.category_id || !row.title) {
        result.failed++;
        result.errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
        continue;
      }

      const productData = {
        activity_type_id: row.activity_type_id || null,
        category_id: row.category_id,
        title: row.title,
        sub_title: row.sub_title || null,
        description: row.description || null,
        price: parseFloat(String(row.price)) || 0,
        image_url: row.image_url || null,
        external_url: row.external_url || null,
        city: row.city || null,
        district: row.district || null,
        ticket_rule: row.ticket_rule || null,
        date: row.date || null,
        rating: row.rating ? parseFloat(String(row.rating)) : null,
        is_active: row.is_active !== false,
        priority: row.priority ? parseInt(String(row.priority)) : null, // New field
        full_address: row.full_address || null, // New field
      };

      // Updated: Check if ID exists to determine insert vs update
      if (row.id && row.id.trim() !== '') {
        // Update existing record
        const { error } = await supabase
          .from(TABLES.PRODUCT)
          .update(productData)
          .eq('id', row.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from(TABLES.PRODUCT)
          .insert(productData);

        if (error) throw error;
      }

      result.success++;
    } catch (error) {
      const err = error as Error;
      result.failed++;
      result.errors.push(`Error processing ${row.title}: ${err.message}`);
    }
  }

  return result;
};