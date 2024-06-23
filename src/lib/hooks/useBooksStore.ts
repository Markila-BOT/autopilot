"use client";

import { create } from "zustand";
import supabase from "../supabase/client";
import { toast } from "@/components/ui/use-toast";

export type Book = {
  id: number;
  title: string;
  author: string;
  published_date: string;
  genre: string;
};

type UseBooksState = {
  books: Book[];
  setBooks: (newBooks: Book[]) => void;
  addBook: (newBook: Book) => void;
  deleteBook: (bookId: number) => void;
  editBook: (bookId: number, updatedBook: Book) => void;
};

const useBooksStore = create<UseBooksState>()((set) => ({
  books: [],
  setBooks: (newBooks) => {
    set({ books: newBooks });
  },
  addBook: async (newBook) => {
    const { data, error } = await supabase
      .from("books")
      .insert([newBook])
      .select();
    if (error) {
      console.error("Error adding new book:", error);
    } else {
      set((state) => ({ books: [...data, ...state.books] }));
      toast({
        description: "New book added! 🧠",
        variant: "success",
      });
    }
  },
  deleteBook: async (bookId) => {
    const { data, error } = await supabase
      .from("books")
      .delete()
      .eq("id", bookId);
    if (error) {
      console.error("Error deleting book:", error);
    } else {
      set((state) => ({
        books: state.books.filter((book) => book.id !== bookId),
      }));
      toast({
        description: "Book deleted! 😔",
        variant: "destructive",
      });
    }
  },
  editBook: async (bookId, updatedBook) => {
    console.log("bookId", bookId, "updatedBook", updatedBook);
    const { data, error } = await supabase
      .from("books")
      .update(updatedBook)
      .eq("id", bookId)
      .select();
    if (error) {
      console.error("Error editing book:", error);
    } else {
      set((state) => ({
        books: state.books.map((book) =>
          book.id === bookId ? { ...book, ...updatedBook } : book
        ),
      }));
      toast({
        description: "Book edited! 🧠",
        variant: "success",
      });
    }
  },
}));

export default useBooksStore;
