import { useForm, Controller } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useBooksStore, { Book } from "@/lib/hooks/useBooksStore";

type CreateEditBookProps = {
  isEditing?: boolean;
  bookId?: number | null;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};
const CreateEditBookForm: React.FC<CreateEditBookProps> = ({
  isEditing,
  bookId,
  setEditing,
}) => {
  const { books, addBook, editBook } = useBooksStore();
  const currentBook = books.find((book) => book.id === bookId)!;
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: isEditing ? currentBook.title : "",
      author: isEditing ? currentBook.author : "",
      published_date: isEditing ? currentBook.published_date : "",
      genre: isEditing ? currentBook.genre : "",
    },
  });

  const handleCreateEdit = (data: Book) => {
    if (isEditing) {
      setEditing(false);
      editBook(bookId!, data);
    } else {
      addBook(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreateEdit)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Title */}
        <div className="sm:col-span-2">
          <Input
            type="text"
            {...register("title", { required: true })}
            placeholder="Title"
          />
        </div>

        {/* Author */}
        <div className="sm:col-span-2">
          <Input
            type="text"
            {...register("author", { required: true })}
            placeholder="Author"
          />
        </div>

        {/* Published Date */}
        <div className="w-max">
          <Input
            type="date"
            {...register("published_date", { required: true })}
            placeholder="Published Date"
          />
        </div>

        {/* Genre */}
        <div className="w-full">
          <Input
            type="text"
            {...register("genre", { required: true })}
            placeholder="Genre"
          />
        </div>

        <Button type="submit" className="sm:col-span-2">
          {isEditing ? "Update" : "Create Book"}
        </Button>
      </div>
    </form>
  );
};

export default CreateEditBookForm;
