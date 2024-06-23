import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchBooks from "../api/books";
import useBooksStore from "./useBooksStore";
import { useEffect } from "react";

const useBooksQuery = () => {
  const { setBooks } = useBooksStore();
  const { isPending, isError, data } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [isPending]);

  return { books: data, loading: isPending, error: isError };
};

export default useBooksQuery;
