"use client";

import { useState } from "react";
import useBooksStore from "@/lib/hooks/useBooksStore";
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import CreateEditBookForm from "@/components/bookForm";
import useBooksQuery from "@/lib/hooks/useBooksQuery";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, indexToOrdinalString } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const queryClient = useQueryClient();
  const { loading } = useBooksQuery();

  const [selectedTab, setSelectedTab] = useState<string>("");
  const { books, deleteBook } = useBooksStore();
  const dividedBooks = Array(Math.ceil(books.length / 10))
    .fill(0)
    .map((_, index) => {
      const groupName = index;
      return { [groupName]: books.slice(index * 10, (index + 1) * 10) };
    })
    .reduce((acc, group) => ({ ...acc, ...group }), {});

  const bookKeys = Object.keys(dividedBooks);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);

  const handleEditBook = (bookId: number | null) => {
    if (bookId) {
      setCurrentBookId(bookId);
      setIsEdit(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white"></h2>
        <Sheet
          open={isCreate || isEdit}
          onOpenChange={
            isEdit ? () => setIsEdit(false) : () => setIsCreate(false)
          }
        >
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => setIsCreate(true)}
          >
            Add new book
          </Button>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>{isEdit ? `Edit ` : "Create new book"}</SheetTitle>
              <SheetDescription>
                {isEdit
                  ? "Please update the form to edit this book."
                  : "Please fill up the form to add a new book."}
              </SheetDescription>
              <CreateEditBookForm
                bookId={currentBookId}
                isEditing={isEdit}
                setEditing={setIsEdit}
              />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <Tabs className="" defaultValue={bookKeys[0] || "0"}>
        <TabsList className="tabs tabs-lifted">
          {bookKeys.map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                "w-full",
                "tab",
                selectedTab === key && "tab-active"
              )}
              onClick={() => setSelectedTab(key)}
            >
              {indexToOrdinalString(Number(key))}
            </TabsTrigger>
          ))}
        </TabsList>
        {loading ? (
          <>
            {[...Array(12)].map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full mb-6" />
            ))}
          </>
        ) : (
          <>
            {bookKeys.map((key) => (
              <TabsContent key={key} value={key}>
                <Table>
                  <TableCaption>Book List</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Published Date</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dividedBooks[Number(key)].map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.published_date}</TableCell>
                        <TableCell>{book.genre}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditBook(book.id)}
                            className="mr-2"
                          >
                            <Pencil2Icon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteBook(book.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </main>
  );
}
