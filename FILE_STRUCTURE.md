# How to Add Your 3D Model and Photos

## Step 1: Prepare Your Files

### 3D Model Requirements:
- **Format**: GLB (recommended) or GLTF
- **Size**: Under 10MB for web performance
- **Optimization**: Use tools like Blender or online converters to optimize

### Photo Requirements:
- **Format**: JPG, PNG, or WebP
- **Resolution**: 1200x1200px minimum for main photos
- **Quantity**: 3-5 photos showing different angles

## Step 2: File Placement

### Place your 3D model in:
\`\`\`
public/models/your-model.glb
\`\`\`

### Place your photos in:
\`\`\`
public/images/your-product-main.jpg
public/images/your-product-side.jpg
public/images/your-product-detail.jpg
public/images/your-product-lifestyle.jpg
\`\`\`

## Step 3: Update Product Data

1. Edit `lib/user-products.ts`
2. Replace placeholder values with your actual product information
3. Update file paths to match your uploaded files

## Step 4: Test Your Product

1. Visit `/products` to see your product in the gallery
2. Click on your product to view details
3. Test the AR functionality with the "View in AR" button

## Supported 3D Model Formats:

- **GLB**: Binary GLTF (recommended for web)
- **GLTF**: Text-based GLTF with separate texture files
- **USDZ**: For iOS AR (optional, will fallback to GLB)

## Photo Guidelines:

- **Main Photo**: Front view, well-lit, neutral background
- **Side Photo**: Profile view showing depth and proportions
- **Detail Photo**: Close-up of materials, textures, or features
- **Lifestyle Photo**: Product in a real room setting (optional)
