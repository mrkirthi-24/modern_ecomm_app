import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import EditProductDialog from "./EditProductDetails";
import ViewProductDetails from "./ViewProductDetails";
import CreateProductDialog, { calculateDiscount } from "./CreateProduct";

import axios from "axios";
import DeleteProduct from "./DeleteProduct";
import { useRecoilState } from "recoil";
import { productsState } from "../store/atoms/products";
import { GetProductsProps, ProductCardProps } from "./types";

const Products = () => {
  const navigate = useNavigate();
  const [productState, setProductState] = useRecoilState(productsState);

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      await axios
        .get("http://localhost:3000/admin/products", { headers })
        .then((response) => {
          setProductState(() => ({
            products: response.data,
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Grid container mt={2} display="flex" justifyContent="flex-end">
        <Grid item xs={2} mr={-2.5}>
          <CreateProductDialog />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            <HomeIcon /> &nbsp; Go to Home page
          </Button>
        </Grid>
        <Grid item xs={12} mt={5} display="flex" justifyContent="center">
          <GetProducts products={productState.products} />
        </Grid>
      </Grid>
    </Box>
  );
};

const GetProducts: React.FC<GetProductsProps> = ({ products }) => {
  return (
    <Box
      width="95%"
      display="flex"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      {products.map((product, index) => (
        <ProductCard key={index} product={product} showAction={true} />
      ))}
    </Box>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAction,
}) => {
  const { title, description, imageUrl, quantity, category, mrp, sell } =
    product;
  const image = imageUrl
    ? imageUrl
    : "https://static-assets-web.flixcart.com/www/linchpin/batman-returns/images/fk-default-image-75ff340b.png?q=90";
  return (
    <Card sx={CardStyles}>
      <CardMedia sx={{ height: 200 }} image={image} title={title} />
      <CardContent>
        <Typography
          gutterBottom
          component="div"
          fontSize={12}
          display="flex"
          justifyContent="space-between"
        >
          <span>
            Category: <b>{category}</b>
          </span>
          <span>
            Qty: <b>{quantity}</b>
          </span>
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          display="flex"
          justifyContent="space-between"
          mt={1}
          mb={5}
        >
          <span>
            MRP: ₹<b>{mrp}</b>
          </span>
          <span>
            Sell Price: ₹<b>{sell}</b>
          </span>
          <span style={{ color: "green" }}>
            Discount: {calculateDiscount(mrp, sell)}%
          </span>
        </Typography>
      </CardContent>
      {showAction && (
        <CardActions sx={CardActionStyles}>
          <Box display="flex">
            <ViewProductDetails product={product} />
            <EditProductDialog product={product} />
          </Box>
          <DeleteProduct productId={product._id} />
        </CardActions>
      )}
    </Card>
  );
};

//Component styles ----------------------------------------------------------------

const CardStyles = {
  minWidth: 250,
  maxWidth: 250,
  minHeight: 400,
  marginBottom: 5,
  position: "relative",
};

const CardActionStyles = {
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  width: "100%",
  bottom: 0,
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
};

export default Products;
