import { AdMenuItem, AdModules, menuStartUp } from "admister";
import { AdProducts } from "./ad-products";
import { AdProductsGroup } from "./ad-products-group";
import { AdProductsSubGroup } from "./ad-products-subgroup";

const items: AdMenuItem[] = [
  { module: AdModules.PRODUCTS, register: AdProducts },
  { module: AdModules.PRODUCTS_GROUP, register: AdProductsGroup },
  { module: AdModules.PRODUCTS_SUBGROUP, register: AdProductsSubGroup },
];

menuStartUp(items).style.putAsBody();
