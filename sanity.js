import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "bbw84viu",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-10-29",
  token:
    "skEKILkx4kblV7sJxLtivVC3gS9XpatSygbnqChLpaSBh0fnzhRSR9KAw4gNMBaRUYyCG3G5h4jjHK20wmQMfGra6Xpa4tSoeCC34oKmHEUM58XbjVP2WA1M2IGVKZAtSe345jdDaDzoNpAXK7qIlG2KMPiDLbEahwlyvNCCcJdBtj8s4dEX",
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

export const getCategory = async () => {
  const items = await client.fetch("*[_type=='category']").then((data) => {
    return data;
  });
  return items;
};

export const getCategoryItems = async (id) => {
  const items = await client
    .fetch(`*[_type=="items" && $id in categories[]->_id]`, { id })
    .then((data) => {
      return data;
    });
  return items;
};

export const getItemById = async (id) => {
  const item = await client
    .fetch(`*[_type=="items" && _id==$id][0]`, { id })
    .then((data) => {
      return data;
    });
  return item;
};

export const createPost = async (doc) => {
  const data = await client.create(doc).catch((e) => console.log(e));
  return data;
};
