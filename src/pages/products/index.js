import dynamic from "next/dynamic"


const Products = dynamic(() => import("../../modules/products/index.jsx"), { ssr: false })

const ProductsPage = ( ) => {
  return <Products  />
}

export default ProductsPage

