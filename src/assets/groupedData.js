import p1_img from "./01.jpg";
import p2_img from "./02.jpg";
import p3_img from "./03.jpg";
import p4_img from "./04.jpg";
import p5_img from "./05.jpg";
import p6_img from "./06.jpg";
import p7_img from "./07.jpg";
import p8_img from "./08.jpg";
import p9_img from "./09.jpg";
import p10_img from "./10.jpg";
import p11_img from "./11.jpg";

// Original flat data
let flat_data_product = [
  {
    id: 1,
    name: "01 Semua Masyayikh - Banner",
    image: p1_img,
    desc: "Banner tanpa pigura",
    subt: "Ukuran 40 x 150 cm",
    price: 50000,
  },
  {
    id: 2,
    name: "02 Dua Kiai - 16R (New)",
    image: p2_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 60 x 40 cm",
    price: 200000,
  },
  {
    id: 3,
    name: "02 Dua Kiai - 14RS",
    image: p2_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 45 x 30 cm",
    price: 100000,
  },
  {
    id: 4,
    name: "02 Dua Kiai - 10RS",
    image: p2_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 35 x 25 cm",
    price: 60000,
  },
  {
    id: 5,
    name: "03 Semua Masyayikh - 16R (New)",
    image: p3_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 60 x 40 cm",
    price: 200000,
  },
  {
    id: 6,
    name: "03 Semua Masyayikh - 14RS",
    image: p3_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 45 x 30 cm",
    price: 100000,
  },
  {
    id: 7,
    name: "03 Semua Masyayikh - 10RS",
    image: p3_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 35 x 25 cm",
    price: 60000,
  },
  {
    id: 8,
    name: "04 Tiga Kiai - 16R (New)",
    image: p4_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 60 x 40 cm",
    price: 200000,
  },
  {
    id: 9,
    name: "04 Tiga Kiai - 14RS",
    image: p4_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 45 x 30 cm",
    price: 100000,
  },
  {
    id: 10,
    name: "04 Tiga Kiai - 10RS",
    image: p4_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 35 x 25 cm",
    price: 60000,
  },
  {
    id: 11,
    name: "05 KH. Ahmad Baidlowi - 16R (New)",
    image: p5_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 40 x 60 cm",
    price: 200000,
  },
  {
    id: 12,
    name: "05 KH. Ahmad Baidlowi - 14RS",
    image: p5_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 30 x 45 cm",
    price: 100000,
  },
  {
    id: 13,
    name: "05 KH. Ahmad Baidlowi - 10RS",
    image: p5_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 25 x 35 cm",
    price: 60000,
  },
  {
    id: 14,
    name: "06 KH. Ahmad Baidlowi - 16R (New)",
    image: p6_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 40 x 60 cm",
    price: 200000,
  },
  {
    id: 15,
    name: "06 KH. Ahmad Baidlowi - 14RS",
    image: p6_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 30 x 45 cm",
    price: 100000,
  },
  {
    id: 16,
    name: "06 KH. Ahmad Baidlowi - 10RS",
    image: p6_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 25 x 35 cm",
    price: 60000,
  },
  {
    id: 17,
    name: "07 KH. Ahmad Baidlowi - 16R (New)",
    image: p7_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 40 x 60 cm",
    price: 200000,
  },
  {
    id: 18,
    name: "07 KH. Ahmad Baidlowi - 14RS",
    image: p7_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 30 x 45 cm",
    price: 100000,
  },
  {
    id: 19,
    name: "07 KH. Ahmad Baidlowi - 10RS",
    image: p7_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 25 x 35 cm",
    price: 60000,
  },
  {
    id: 20,
    name: "08 KH. Ahmad Baidlowi - 16R (New)",
    image: p8_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 40 x 60 cm",
    price: 200000,
  },
  {
    id: 21,
    name: "08 KH. Ahmad Baidlowi - 14RS",
    image: p8_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 30 x 45 cm",
    price: 100000,
  },
  {
    id: 22,
    name: "08 KH. Ahmad Baidlowi - 10RS",
    image: p8_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 25 x 35 cm",
    price: 60000,
  },
  {
    id: 23,
    name: "09 KH. Abdul Hannan - 16R (New)",
    image: p9_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 40 x 60 cm",
    price: 200000,
  },
  {
    id: 24,
    name: "09 KH. Abdul Hannan - 14RS",
    image: p9_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 30 x 45 cm",
    price: 100000,
  },
  {
    id: 25,
    name: "09 KH. Abdul Hannan - 10RS",
    image: p9_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 25 x 35 cm",
    price: 60000,
  },
  {
    id: 26,
    name: "10 KH. Ali Wafa - 16R (New)",
    image: p10_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 40 x 60 cm",
    price: 200000,
  },
  {
    id: 27,
    name: "10 KH. Ali Wafa - 14RS",
    image: p10_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 30 x 45 cm",
    price: 100000,
  },
  {
    id: 28,
    name: "10 KH. Ali Wafa - 10RS",
    image: p10_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 25 x 35 cm",
    price: 60000,
  },
  {
    id: 29,
    name: "11 KH. Ali Wafa - 16R (New)",
    image: p11_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 40 x 60 cm",
    price: 200000,
  },
  {
    id: 30,
    name: "11 KH. Ali Wafa - 14RS",
    image: p11_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 30 x 45 cm",
    price: 100000,
  },
  {
    id: 31,
    name: "11 KH. Ali Wafa - 10RS",
    image: p11_img,
    desc: "Foto+Pigura",
    subt: "Ukuran 25 x 35 cm",
    price: 60000,
  },
];

// Function to group products by their main category (the numbered part with name)
function groupProductsByCategory(products) {
  const grouped = {};
  
  products.forEach(product => {
    // Extract the main category (number + main name), e.g. "02 Dua Kiai", "03 Semua Masyayikh"
    const nameParts = product.name.split(' - ');
    const baseName = nameParts[0];
    
    if (!grouped[baseName]) {
      grouped[baseName] = {
        id: baseName, // Use base name as ID
        name: baseName,
        image: product.image, // Use the first image as the main image
        desc: product.desc,
        variants: []
      };
    }
    
    // Add variant information
    const variantInfo = {
      id: product.id,
      name: product.name,
      image: product.image,
      desc: product.desc,
      subt: product.subt,
      price: product.price
    };
    
    grouped[baseName].variants.push(variantInfo);
  });
  
  // Convert to array and sort by the number at the beginning of the name
  const result = Object.values(grouped).sort((a, b) => {
    const numA = parseInt(a.name.split(' ')[0]);
    const numB = parseInt(b.name.split(' ')[0]);
    return numA - numB;
  });
  
  return result;
}

// Group the products
const grouped_data_product = groupProductsByCategory(flat_data_product);

export default grouped_data_product;

// Also export the original flat data if needed elsewhere
export { flat_data_product };