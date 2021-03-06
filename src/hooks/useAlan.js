import { useEffect, useState, useCallback } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useCart } from "../context/CartContext";
import storeItems from "../items.json";
const COMMANDS = {
  OPEN_CART: "open-cart",
  CLOSE_CART: "close-cart",
  ADD_ITEM: "add-item",
  REMOVE_ITEM: "remove-item",
  PURCHASE_ITEMS: 'purchase-items'
};

export default function useAlan() {
  const [alanInstance, setAlanInstance] = useState();
  const { setShowCartItems, isCartEmpty, addToCart ,removeFromCart,cart,checkout} = useCart();
  const openCart = useCallback(() => {
    if (isCartEmpty) {
      alanInstance.playText("You have no items in your cart");
    } else {
      alanInstance.playText("Opening cart");
      setShowCartItems(true);
    }
  }, [alanInstance, isCartEmpty, setShowCartItems]);
  // -----------Close Cart--------------
  const closeCart = useCallback(() => {
    if (isCartEmpty) {
      alanInstance.playText("You have no items in your cart");
    } else {
      alanInstance.playText("Closing cart");
      setShowCartItems(false);
    }
  }, [alanInstance, isCartEmpty, setShowCartItems]);
  const addItem = useCallback(({ detail: { name, quantity } }) => {
    const item = storeItems.find(
      i => i.name.toLowerCase() === name.toLowerCase())
    if (item == null) {
      alanInstance.playText(`I cannot find the ${name} item`);
    } else {
      addToCart(item.id, quantity);
      alanInstance.playText(`Add ${quantity} of the ${name} item to your cart`)
    }
  },[alanInstance,addToCart]);
  // ---------------------End CloseCart-------------
  // -------------------Remove Item--------------------
  const removeItem = useCallback(({ detail: { name } }) => {
    const entry = cart.find(
      e => e.item.name.toLowerCase() === name.toLowerCase())
    if (entry == null) {
      alanInstance.playText(`I cannot find the ${name} item in your cart`);
    } else {
      removeFromCart(entry.itemId);
      alanInstance.playText(`Remove the ${name} item form your cart`)
    }
  },[alanInstance,removeFromCart,cart]);
  // -----------------------End Remove Item--------------
  const purchaseItems = useCallback(()=>{
    if(isCartEmpty){
      alanInstance.playText("Your cart is empty")
    } else {
      alanInstance.playText("Chacking out")
      checkout()
    }
  },[alanInstance,isCartEmpty,checkout])
  // -------------------End Purchase Items-----------------------------
  useEffect(() => {
    window.addEventListener(COMMANDS.OPEN_CART, openCart);
    window.addEventListener(COMMANDS.CLOSE_CART, closeCart);
    window.addEventListener(COMMANDS.ADD_ITEM, addItem);
    window.addEventListener(COMMANDS.REMOVE_ITEM, removeItem);
    window.addEventListener(COMMANDS.PURCHASE_ITEMS, purchaseItems);
    return () => {
      window.removeEventListener(COMMANDS.OPEN_CART, openCart);
      window.removeEventListener(COMMANDS.CLOSE_CART, closeCart);
      window.removeEventListener(COMMANDS.ADD_ITEM, addItem);
      window.removeEventListener(COMMANDS.REMOVE_ITEM, removeItem);
      window.removeEventListener(COMMANDS.PURCHASE_ITEMS, purchaseItems);
    };
  }, [openCart, closeCart, addItem,removeItem,purchaseItems]);
  useEffect(() => {
    if (alanInstance != null) return;
    setAlanInstance(
      alanBtn({
        top: "15px",
        left: "15px",
        key: "5fbba2b0b4593506ce9f5f821a49f2f12e956eca572e1d8b807a3e2338fdd0dc/stage",
        onCommand: ({ command, payload }) => {
          window.dispatchEvent(new CustomEvent(command, { detail: payload }));
          // console.log(commandData)
        },
      })
    );
  }, []);
  return null;
}


