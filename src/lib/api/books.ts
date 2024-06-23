import supabase from "../supabase/client";

const fetchBooks = async () => {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
  return data;
};

export default fetchBooks;
