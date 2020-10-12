//creado em https://skeletonreact.com/ 

import React from "react"
import ContentLoader from "react-content-loader"
import { generateList } from "core/utils/list";

const ProductCardLoader = () => {

   const loaderItems = generateList(8);

   return (
      <>
         {loaderItems.map(item =>
            <ContentLoader
               key={item}
               speed={1}
               width={210}
               height={285}
               viewBox="0 0 210 285"
               backgroundColor="#ecebeb"
               foregroundColor="#d6d2d2"
            >
               <rect x="0" y="0" rx="10" ry="10" width="210" height="285" />
            </ContentLoader>
         )}
      </>
   )
}

export default ProductCardLoader