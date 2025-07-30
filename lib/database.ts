import { Pool } from "pg"
import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Database connection using the provided PostgreSQL credentials
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // true in prod, false in dev
  },
});
 console.log(`env data ${process.env.NODE_ENV}`)

export interface Company {
  id: number
  shop_name: string
  subdomain: string
  description: string
  logo: string
  phone: string
  whatsapp: string
  website: string
  status: "Active" | "Suspended"
  plan: "Trial" | "Paid"
  join_date: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  discount_price?: number
  discount_percentage: number
  effective_price: number
  company_id: number
  company: {
    id: number
    name: string
    subdomain: string
    description: string
    logo: string
  }
  category: string
  images: string[]
  image_1: string
  image_2: string
  image_3: string
  image_4: string
  dimensions: string
  weight: string
  material: string
  color: string
  ar_scale: number
  ar_placement: "floor" | "wall" | "table"
  has_ar: boolean
  glb_file: string
  usdz_file: string
  featured: boolean
  status: "Active" | "Inactive"
  created_at: string
  updated_at: string
}

export interface ARRequest {
  id: number
  product: number
  shop: number
  status: "Pending" | "Approved" | "Rejected"
  request_date: string
  approved_date?: string
  rejected_date?: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  discount_price?: number
  dimensions?: string
  category?: string
  material?: string
  color?: string
  images: string[]
  shop_id: number
}

export interface CreateCompanyData {
  shop_name: string
  subdomain: string
  description?: string
  phone: string
  whatsapp?: string
  plan: "Trial" | "Paid"
  status: "Active" | "Suspended"
}

class DatabaseManager {
  // Initialize database tables
  async initializeTables() {
    const client = await pool.connect()
    try {
      // Create companies table
      await client.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id SERIAL PRIMARY KEY,
          shop_name VARCHAR(255) NOT NULL,
          subdomain VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          logo TEXT,
          phone VARCHAR(20),
          whatsapp VARCHAR(20),
          website TEXT,
          status VARCHAR(20) DEFAULT 'Active',
          plan VARCHAR(20) DEFAULT 'Trial',
          join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create products table
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          discount_price DECIMAL(10,2),
          company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
          category VARCHAR(100),
          image_1 TEXT,
          image_2 TEXT,
          image_3 TEXT,
          image_4 TEXT,
          dimensions VARCHAR(100),
          weight VARCHAR(50),
          material VARCHAR(100),
          color VARCHAR(50),
          ar_scale DECIMAL(5,2) DEFAULT 1.0,
          ar_placement VARCHAR(20) DEFAULT 'floor',
          has_ar BOOLEAN DEFAULT FALSE,
          glb_file TEXT,
          usdz_file TEXT,
          featured BOOLEAN DEFAULT FALSE,
          status VARCHAR(20) DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create ar_requests table
      await client.query(`
        CREATE TABLE IF NOT EXISTS ar_requests (
          id SERIAL PRIMARY KEY,
          product INTEGER REFERENCES products(id) ON DELETE CASCADE,
          shop INTEGER REFERENCES companies(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'Pending',
          request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          approved_date TIMESTAMP,
          rejected_date TIMESTAMP
        )
      `)

      console.log("✅ Database tables initialized successfully")

      // Check if we need to seed data
      const companiesResult = await client.query("SELECT COUNT(*) FROM companies")
      const companiesCount = Number.parseInt(companiesResult.rows[0].count)

      if (companiesCount === 0) {
        await this.seedSampleData(client)
      }
    } catch (error) {
      console.error("❌ Error initializing database:", error)
      throw error
    } finally {
      client.release()
    }
  }

  async seedSampleData(client: any) {
    try {
      console.log("🌱 Seeding sample data...")

      // Insert sample companies
      const companies = [
        {
          shop_name: "Demo Furniture Store",
          subdomain: "demo",
          description: "Premium furniture with AR visualization",
          phone: "+91 98765 43210",
          whatsapp: "+91 98765 43210",
          website: "https://demo.localhost:3000",
        },
        {
          shop_name: "Modern Electronics",
          subdomain: "electronics",
          description: "Latest gadgets and electronics",
          phone: "+91 98765 43211",
          whatsapp: "+91 98765 43211",
          website: "https://electronics.localhost:3000",
        },
        {
          shop_name: "Fashion Hub",
          subdomain: "fashion",
          description: "Trendy clothing and accessories",
          phone: "+91 98765 43212",
          whatsapp: "+91 98765 43212",
          website: "https://fashion.localhost:3000",
        },
      ]

      for (const company of companies) {
        await client.query(
          `
          INSERT INTO companies (shop_name, subdomain, description, phone, whatsapp, website)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [company.shop_name, company.subdomain, company.description, company.phone, company.whatsapp, company.website],
        )
      }

      // Get company IDs
      const demoCompany = await client.query("SELECT id FROM companies WHERE subdomain = $1", ["demo"])
      const electronicsCompany = await client.query("SELECT id FROM companies WHERE subdomain = $1", ["electronics"])
      const fashionCompany = await client.query("SELECT id FROM companies WHERE subdomain = $1", ["fashion"])

      const demoId = demoCompany.rows[0].id
      const electronicsId = electronicsCompany.rows[0].id
      const fashionId = fashionCompany.rows[0].id

      // Insert sample products for demo furniture store
      const demoProducts = [
        {
          name: "Modern Sofa",
          description: "Comfortable 3-seater sofa with premium fabric upholstery. Perfect for modern living rooms.",
          price: 79900,
          discount_price: 69900,
          category: "Furniture",
          image_1: "/placeholder.svg?height=400&width=600&text=Modern+Sofa",
          dimensions: "200cm × 90cm × 85cm",
          material: "Premium Fabric",
          color: "Charcoal Gray",
          has_ar: true,
          featured: true,
        },
        {
          name: "Dining Table",
          description: "Elegant wooden dining table for 6 people. Crafted from solid oak wood.",
          price: 65900,
          discount_price: 59900,
          category: "Furniture",
          image_1: "/placeholder.svg?height=400&width=600&text=Dining+Table",
          dimensions: "180cm × 90cm × 75cm",
          material: "Solid Oak Wood",
          color: "Natural Brown",
          has_ar: true,
          featured: true,
        },
        {
          name: "Office Chair",
          description: "Ergonomic office chair with lumbar support and adjustable height.",
          price: 24900,
          category: "Furniture",
          image_1: "/placeholder.svg?height=400&width=600&text=Office+Chair",
          dimensions: "65cm × 65cm × 110cm",
          material: "Mesh & Plastic",
          color: "Black",
          has_ar: true,
        },
        {
          name: "Coffee Table",
          description: "Stylish glass-top coffee table with wooden legs.",
          price: 18900,
          discount_price: 16900,
          category: "Furniture",
          image_1: "/placeholder.svg?height=400&width=600&text=Coffee+Table",
          dimensions: "120cm × 60cm × 45cm",
          material: "Glass & Wood",
          color: "Clear & Natural",
          has_ar: true,
        },
      ]

      for (const product of demoProducts) {
        await client.query(
          `
          INSERT INTO products (name, description, price, discount_price, company_id, category, image_1, dimensions, material, color, has_ar, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
          [
            product.name,
            product.description,
            product.price,
            product.discount_price,
            demoId,
            product.category,
            product.image_1,
            product.dimensions,
            product.material,
            product.color,
            product.has_ar,
            product.featured,
          ],
        )
      }

      // Insert sample products for electronics store
      const electronicsProducts = [
        {
          name: "iPhone 15 Pro",
          description: "Latest iPhone with advanced camera system and A17 Pro chip.",
          price: 134900,
          discount_price: 129900,
          category: "Smartphones",
          image_1: "/placeholder.svg?height=400&width=600&text=iPhone+15+Pro",
          dimensions: "14.67cm × 7.09cm × 0.83cm",
          material: "Titanium",
          color: "Natural Titanium",
          has_ar: true,
          featured: true,
        },
        {
          name: "MacBook Air M3",
          description: "Ultra-thin laptop with M3 chip and all-day battery life.",
          price: 114900,
          category: "Laptops",
          image_1: "/placeholder.svg?height=400&width=600&text=MacBook+Air+M3",
          dimensions: "30.41cm × 21.5cm × 1.13cm",
          material: "Aluminum",
          color: "Space Gray",
          has_ar: true,
          featured: true,
        },
      ]

      for (const product of electronicsProducts) {
        await client.query(
          `
          INSERT INTO products (name, description, price, discount_price, company_id, category, image_1, dimensions, material, color, has_ar, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
          [
            product.name,
            product.description,
            product.price,
            product.discount_price,
            electronicsId,
            product.category,
            product.image_1,
            product.dimensions,
            product.material,
            product.color,
            product.has_ar,
            product.featured,
          ],
        )
      }

      // Insert sample products for fashion store
      const fashionProducts = [
        {
          name: "Designer T-Shirt",
          description: "Premium cotton t-shirt with modern design.",
          price: 2999,
          discount_price: 2499,
          category: "Clothing",
          image_1: "/placeholder.svg?height=400&width=600&text=Designer+T-Shirt",
          material: "Premium Cotton",
          color: "Navy Blue",
          featured: true,
        },
        {
          name: "Leather Jacket",
          description: "Genuine leather jacket with classic styling.",
          price: 12999,
          discount_price: 10999,
          category: "Clothing",
          image_1: "/placeholder.svg?height=400&width=600&text=Leather+Jacket",
          material: "Genuine Leather",
          color: "Black",
          featured: true,
        },
      ]

      for (const product of fashionProducts) {
        await client.query(
          `
          INSERT INTO products (name, description, price, discount_price, company_id, category, image_1, material, color, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
          [
            product.name,
            product.description,
            product.price,
            product.discount_price,
            fashionId,
            product.category,
            product.image_1,
            product.material,
            product.color,
            product.featured,
          ],
        )
      }

      console.log("✅ Sample data seeded successfully")
    } catch (error) {
      console.error("❌ Error seeding sample data:", error)
      throw error
    }
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    const result = await pool.query("SELECT * FROM companies ORDER BY created_at DESC")
    return result.rows
  }

  async getCompanyBySubdomain(subdomain: string): Promise<Company | null> {
    const result = await pool.query("SELECT * FROM companies WHERE subdomain = $1", [subdomain])
    return result.rows[0] || null
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const result = await pool.query(
      `
      INSERT INTO companies (shop_name, subdomain, description, phone, whatsapp, plan, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [data.shop_name, data.subdomain, data.description, data.phone, data.whatsapp, data.plan, data.status],
    )

    return result.rows[0]
  }

  // Product methods
  
  async getProducts(companyId?: number): Promise<Product[]> {
    // Setup Backblaze S3-compatible client
    const s3Client = new S3Client({
      region: "us-west-004",
      endpoint: "https://s3.us-east-005.backblazeb2.com",
      credentials: {
        accessKeyId: process.env.B2_KEY_ID!,
        secretAccessKey: process.env.B2_APPLICATION_KEY!,
      },
    })

    // Inline helper to generate signed URL
    const generateSignedUrl = async (key: string, expiresIn = 3600) => {
      const command = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
      })
      return await getSignedUrl(s3Client, command, { expiresIn })
    }

    // Build SQL query
    let query = `
      SELECT p.*, c.shop_name as company_name, c.subdomain as company_subdomain, c.description as company_description, c.logo as company_logo
      FROM products p
      JOIN companies c ON p.company_id = c.id
      WHERE p.status = 'Active'
    `
    const params: any[] = []

    if (companyId) {
      query += " AND p.company_id = $1"
      params.push(companyId)
    }

    query += " ORDER BY p.featured DESC, p.created_at DESC"

    const result = await pool.query(query, params)
    

    // Return products with signed URLs
    const products = await Promise.all(
      result.rows.map(async (row) => {
        const getImageUrl = async (key: string | null) => {
          if (!key) return null;
        
          try {
            const command = new GetObjectCommand({
              Bucket: process.env.B2_BUCKET_NAME!,
              Key: key, // This must match what's in the DB
            });
        
            const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
            return signedUrl;
          } catch (error) {
            console.error(`Error signing URL for ${key}:`, error);
            return null;
          }
        };
        
    
        const imageFiles = [row.image_1, row.image_2, row.image_3, row.image_4].filter(Boolean);
        const signedImages = await Promise.all(imageFiles.map((file) => getImageUrl(file)));
        const out_data= await getImageUrl(row.image_1)
        console.log(out_data)
    
    

        return {
          id: row.id,
          name: row.name,
          description: row.description,
          price: Number.parseFloat(row.price),
          discount_price: row.discount_price ? Number.parseFloat(row.discount_price) : undefined,
          discount_percentage: row.discount_price
            ? Math.round(
                ((Number.parseFloat(row.price) - Number.parseFloat(row.discount_price)) / Number.parseFloat(row.price)) *
                  100,
              )
            : 0,
          effective_price: row.discount_price ? Number.parseFloat(row.discount_price) : Number.parseFloat(row.price),
          company_id: row.company_id,
          company: {
            id: row.company_id,
            name: row.company_name,
            subdomain: row.company_subdomain,
            description: row.company_description,
            logo: row.company_logo,
          },
          category: row.category,
          images: signedImages,
          image_1: await getImageUrl(row.image_1),
          image_2: await getImageUrl(row.image_2),
          image_3: await getImageUrl(row.image_3),
          image_4: await getImageUrl(row.image_4),
          dimensions: row.dimensions,
          weight: row.weight,
          material: row.material,
          color: row.color,
          ar_scale: Number.parseFloat(row.ar_scale) || 1.0,
          ar_placement: row.ar_placement || "floor",
          has_ar: row.has_ar,
          glb_file: row.glb_file ? await generateSignedUrl(row.glb_file) : null,
          usdz_file: row.usdz_file ? await generateSignedUrl(row.usdz_file) : null,
          featured: row.featured,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }
      }),
    )

    return products
  }

  async getProductsBySubdomain(subdomain: string): Promise<Product[]> {
    const company = await this.getCompanyBySubdomain(subdomain)
    if (!company) {
      return []
    }
    return this.getProducts(company.id)
  }

  async getProduct(id: number): Promise<Product | null> {
    const s3Client = new S3Client({
      region: "us-west-004",
      endpoint: "https://s3.us-east-005.backblazeb2.com",
      credentials: {
        accessKeyId: process.env.B2_KEY_ID!,
        secretAccessKey: process.env.B2_APPLICATION_KEY!,
      },
    })

    // Inline helper to generate signed URL
    const generateSignedUrl = async (key: string, expiresIn = 3600) => {
      const command = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
      })
      return await getSignedUrl(s3Client, command, { expiresIn })
    }
    const result = await pool.query(
      `
      SELECT p.*, c.shop_name as company_name, c.subdomain as company_subdomain, c.description as company_description, c.logo as company_logo
      FROM products p
      JOIN companies c ON p.company_id = c.id
      WHERE p.id = $1 AND p.status = 'Active'
    `,
      [id],
    )
    const getImageUrl = async (key: string | null) => {
      if (!key) return null;
    
      try {
        const command = new GetObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME!,
          Key: key, // This must match what's in the DB
        });
    
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
        return signedUrl;
      } catch (error) {
        console.error(`Error signing URL for ${key}:`, error);
        return null;
      }
    };
    

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    const imageFiles = [row.image_1, row.image_2, row.image_3, row.image_4].filter(Boolean);
    const signedImages = await Promise.all(imageFiles.map((file) => getImageUrl(file)));
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number.parseFloat(row.price),
      discount_price: row.discount_price ? Number.parseFloat(row.discount_price) : undefined,
      discount_percentage: row.discount_price
        ? Math.round(
            ((Number.parseFloat(row.price) - Number.parseFloat(row.discount_price)) / Number.parseFloat(row.price)) *
              100,
          )
        : 0,
      effective_price: row.discount_price ? Number.parseFloat(row.discount_price) : Number.parseFloat(row.price),
      company_id: row.company_id,
      company: {
        id: row.company_id,
        name: row.company_name,
        subdomain: row.company_subdomain,
        description: row.company_description,
        logo: row.company_logo,
      },
      category: row.category,
      images: signedImages,
      image_1: await getImageUrl(row.image_1),
      image_2: await getImageUrl(row.image_2),
      image_3: await getImageUrl(row.image_3),
      image_4: await getImageUrl(row.image_4),
      dimensions: row.dimensions,
      weight: row.weight,
      material: row.material,
      color: row.color,
      ar_scale: Number.parseFloat(row.ar_scale) || 1.0,
      ar_placement: row.ar_placement || "floor",
      has_ar: row.has_ar,
      glb_file: await generateSignedUrl(row.glb_file),
      usdz_file: await generateSignedUrl(row.usdz_file),
      featured: row.featured,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const result = await pool.query(
      `
      INSERT INTO products (name, description, price, discount_price, company_id, category, image_1, dimensions, material, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
      [
        data.name,
        data.description,
        data.price,
        data.discount_price,
        data.shop_id,
        data.category,
        data.images[0],
        data.dimensions,
        data.material,
        data.color,
      ],
    )

    return this.getProduct(result.rows[0].id) as Promise<Product>
  }

  async updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount}`)
      values.push(data.name)
      paramCount++
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount}`)
      values.push(data.description)
      paramCount++
    }
    if (data.price !== undefined) {
      updates.push(`price = $${paramCount}`)
      values.push(data.price)
      paramCount++
    }
    if (data.discount_price !== undefined) {
      updates.push(`discount_price = $${paramCount}`)
      values.push(data.discount_price)
      paramCount++
    }
    if (data.category !== undefined) {
      updates.push(`category = $${paramCount}`)
      values.push(data.category)
      paramCount++
    }
    if (data.dimensions !== undefined) {
      updates.push(`dimensions = $${paramCount}`)
      values.push(data.dimensions)
      paramCount++
    }
    if (data.material !== undefined) {
      updates.push(`material = $${paramCount}`)
      values.push(data.material)
      paramCount++
    }
    if (data.color !== undefined) {
      updates.push(`color = $${paramCount}`)
      values.push(data.color)
      paramCount++
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    await pool.query(
      `
      UPDATE products 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
    `,
      values,
    )

    return this.getProduct(id) as Promise<Product>
  }

  async deleteProduct(id: number): Promise<void> {
    await pool.query("UPDATE products SET status = $1 WHERE id = $2", ["Inactive", id])
  }

  // AR Request methods
  async getARRequests(): Promise<ARRequest[]> {
    const result = await pool.query("SELECT * FROM ar_requests ORDER BY request_date DESC")
    return result.rows
  }

  async createARRequest(productId: number, shopId: number): Promise<ARRequest> {
    const result = await pool.query(
      `
      INSERT INTO ar_requests (product, shop)
      VALUES ($1, $2)
      RETURNING *
    `,
      [productId, shopId],
    )
    return result.rows[0]
  }

  async updateARRequest(id: number, data: Partial<ARRequest>): Promise<ARRequest> {
    const client = await pool.connect()
    try {
      const fields = []
      const values = []
      let paramCount = 1

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${key} = $${paramCount}`)
          values.push(value)
          paramCount++
        }
      })

      values.push(id)

      const query = `
        UPDATE ar_requests 
        SET ${fields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *
      `

      const result = await client.query(query, values)
      return result.rows[0]
    } finally {
      client.release()
    }
  }
}

export const db = new DatabaseManager()
