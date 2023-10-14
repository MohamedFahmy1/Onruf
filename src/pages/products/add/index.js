import AddProduct from "../../../modules/products/add";
import Head from "next/head";

const AddProductPage = () => {
    return (
        <>
            <Head>
                <title>إضافة منتج - اونرف</title>
            </Head>
            <AddProduct />
        </>
    );
}
 
export default AddProductPage;
