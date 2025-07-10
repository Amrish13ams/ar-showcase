import { db, type Company, type Product, type CreateProductData, type CreateCompanyData } from "./database"

interface ApiClientOptions {
  subdomain?: string
}

class ApiClient {
  private getSubdomainFromURL(): string | null {
    if (typeof window === "undefined") return null

    const hostname = window.location.hostname

    // For subdomain.localhost:3000 format
    if (hostname.includes("localhost")) {
      const parts = hostname.split(".")
      if (parts.length > 1 && parts[0] !== "localhost") {
        return parts[0] // demo.localhost → demo
      }
    }

    // For production domains
    if (hostname.includes(".") && !hostname.includes("localhost")) {
      const parts = hostname.split(".")
      if (parts.length > 2) {
        return parts[0] // demo.yourdomain.com → demo
      }
    }

    return null
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    return await db.getCompanies()
  }

  async getCompanyBySubdomain(subdomain: string): Promise<Company | null> {
    return await db.getCompanyBySubdomain(subdomain)
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    return await db.createCompany(data)
  }

  // Product methods
  async getProducts(shopId?: number): Promise<Product[]> {
    const subdomain = this.getSubdomainFromURL()

    if (subdomain && !shopId) {
      return await db.getProductsBySubdomain(subdomain)
    }

    return await db.getProducts(shopId)
  }

  async getProduct(id: number): Promise<Product | null> {
    return await db.getProduct(id)
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    return await db.createProduct(data)
  }

  async updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    return await db.updateProduct(id, data)
  }

  async deleteProduct(id: number): Promise<void> {
    return await db.deleteProduct(id)
  }

  // Helper methods for frontend compatibility
  async getProductsByCompany(subdomain: string) {
    const company = await this.getCompanyBySubdomain(subdomain)
    if (!company) {
      throw new Error("Company not found")
    }

    const products = await db.getProductsBySubdomain(subdomain)

    return {
      company,
      products,
    }
  }
}

export const apiClient = new ApiClient()

// Helper function to get current subdomain
export const getCurrentSubdomain = (): string | null => {
  if (typeof window === "undefined") return null

  const hostname = window.location.hostname

  // For subdomain.localhost:3000 format
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".")
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0] // demo.localhost → demo
    }
  }

  // For production domains
  if (hostname.includes(".") && !hostname.includes("localhost")) {
    const parts = hostname.split(".")
    if (parts.length > 2) {
      return parts[0] // demo.yourdomain.com → demo
    }
  }

  return null
}

// Export types for use in components
export type { Company, Product, CreateProductData, CreateCompanyData }
