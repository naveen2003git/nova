import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export const getProducts = async () => {
  const data = await getDocs(collection(db, "products"));
  const productList = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return productList;
};

export const ProductUpdate = async (editId, product) => {
  if (editId) {
    const productRef = doc(db, "products", editId);
    await updateDoc(productRef, product);
    return true;
  } else {
    await addDoc(collection(db, "products"), product);
    return false;
  }
};

export const DeleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
  return true;
};

export const getUsers = async () => {
  const user = await getDocs(collection(db, "users"));
  const userList = user.docs.map((users) => ({
    id: users.id,
    ...users.data(),
  }));
  return userList;
};

export const cartProduct = async (productId, userId, setSnack) => {
  try {
    const q = query(collection(db, "cart"), where("userId", "==", userId));
    const cartSnapshot = await getDocs(q);

    if (!cartSnapshot.empty) {
      const cartDoc = cartSnapshot.docs[0];
      const cartData = cartDoc.data();

      if (cartData.products.includes(productId)) {
        setSnack({ open: true, message: "Product already in cart", severity: "warning" });
        return;
      }

      await updateDoc(doc(db, "cart", cartDoc.id), {
        products: [...cartData.products, productId],
      });

      setSnack({ open: true, message: "Product added to cart", severity: "success" });
    } else {
      const newCartRef = doc(collection(db, "cart"));
      await setDoc(newCartRef, {
        userId: userId,
        products: [productId],
      });

      setSnack({ open: true, message: "Product added to cart", severity: "success" });
    }
  } catch (error) {
    console.error("Error adding to cart: ", error);
    setSnack({ open: true, message: "Something went wrong!", severity: "error" });
  }
};


export const getUserCartProducts = async (currentUser) => {
  if (!currentUser) return [];

  const userId = currentUser.uid;

  const cartSnapshot = await getDocs(collection(db, "cart"));
  const cartList = cartSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const userCart = cartList.find((cart) => cart.userId === userId);

  if (!userCart || !Array.isArray(userCart.products)) {
    return [];
  }

  const productPromises = userCart.products.map(async (productId) => {
    const productRef = doc(db, "products", productId); // ✅ correct
    const productDoc = await getDoc(productRef);
    return productDoc.exists()
      ? { id: productDoc.id, ...productDoc.data() }
      : null;
  });

  const productDetails = await Promise.all(productPromises);

  return productDetails.filter((product) => product !== null);
};

export const removeCartItem = async (id, user) => {
  const userId = user.uid;

  const q = query(collection(db, "cart"), where("userId", "==", userId));
  const cartSnapshot = await getDocs(q);

  if (!cartSnapshot.empty) {
    const cartDoc = cartSnapshot.docs[0];
    const cartData = cartDoc.data();

    if (cartData.products.includes(id)) {
      const updatedProducts = cartData.products.filter(
        (productId) => productId !== id
      );

      await updateDoc(doc(db, "cart", cartDoc.id), {
        products: updatedProducts,
      });

      console.log("Product removed from cart.");
    } else {
      console.log("Product not found in cart.");
    }
  } else {
    console.log("Cart not found.");
  }
};

export const StorePayment = async ({
  formData,
  cartItems,
  total,
  paymentId,
}) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated.");
    return;
  }

  try {
    const userOrderRef = doc(db, "orders", user.uid); // One doc per user
    const docSnap = await getDoc(userOrderRef);

    const formattedCartItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      status: "Ordered",
    }));

    const newOrder = {
      products: formattedCartItems,
      totalPayment: total,
      paymentId: paymentId,
      userData: formData,
      createdAt: new Date(),
    };

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const updatedOrders = existingData.orders || [];

      await updateDoc(userOrderRef, {
        orders: [...updatedOrders, newOrder],
      });

    } else {
      await setDoc(userOrderRef, {
        userId: user.uid,
        orders: [newOrder],
      });
    }

    // 🔥 Clear purchased items from cart
    const cartQuery = query(
      collection(db, "cart"),
      where("userId", "==", user.uid)
    );
    const cartSnapshot = await getDocs(cartQuery);

    if (!cartSnapshot.empty) {
      const cartDoc = cartSnapshot.docs[0];
      const cartData = cartDoc.data();

      const purchasedIds = cartItems.map((item) => item.id); // Fix here

      const updatedCart = cartData.products.filter(
        (productId) => !purchasedIds.includes(productId)
      );

      await updateDoc(doc(db, "cart", cartDoc.id), {
        products: updatedCart,
      });

      console.log("Purchased products removed from cart.");
    } else {
      console.log("No cart found for user.");
    }
  } catch (error) {
    console.error("Error saving order or cleaning cart:", error);
  }
};

export const getUserOrderProducts = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  const userId = currentUser.uid;
  const orderRef = doc(db, "orders", userId);
  const orderdoc = await getDoc(orderRef);
  if (orderdoc.exists()) {
    const existingData = orderdoc.data();
    return existingData;
  }
};

export const getorders = async () => {
  const ordersRef = collection(db, "orders");
  const snapshot = await getDocs(ordersRef);
  const ordersList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return ordersList;
};

export const getUserProfile = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return {
      fullName: "",
      dob: "",
      mobile: "",
      email: currentUser.email || "",
    };
  }
};

export const profileUpdate = async (profileData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);

  await updateDoc(
    userRef,
    {
      fullName: profileData.fullName,
      dob: profileData.dob,
      mobile: profileData.mobile,
      email: profileData.email,
    },
    { merge: true }
  );
};
export const updateOrderData = async (userId, updatedOrders) => {
  const userDocRef = doc(db, "orders", userId); // Replace "orders" with your collection name if different
  await updateDoc(userDocRef, {
    orders: updatedOrders,
  });
};

export const productReview = async (productId, comment, rating,productName) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  console.log(user);

  const reviewData = {
    userId: user.uid,
    Name: user.email || "Anonymous",
    comment,
    rating,
    productName,
    createdAt: new Date(),
  };

  const reviewRef = collection(doc(db, "products", productId), "reviews");
  await addDoc(reviewRef, reviewData);
  console.log("review added");
};

export const getAllProductsWithReviews = async () => {
  try {
    const productsRef = collection(db, "products");
    const productsSnap = await getDocs(productsRef);

    let allReviews = [];

    for (const productDoc of productsSnap.docs) {
      const productId = productDoc.id;
      const reviewsRef = collection(db, "products", productId, "reviews");
      const reviewsSnap = await getDocs(reviewsRef);

      const reviews = reviewsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      allReviews.push({
        productId,
        reviews, // All reviews for this product
      });
    }
    return allReviews;
  } catch (error) {
    console.error("Error fetching products and reviews:", error);
    return [];
  }
};

export const updateProductStockInFirestore = async (updatedProducts) => {
  const promises = updatedProducts.map(async (product) => {
    const productRef = doc(db, "products", product.id);
    if (product.quantity === 0){
      await updateDoc(productRef, {
        quantity: product.quantity,
        stock: false,
      });
    }
    else {
      await updateDoc(productRef, {
        quantity: product.quantity,
      });
    }
  });

  await Promise.all(promises);
  console.log("Product stock updated in Firestore ✅");
};

