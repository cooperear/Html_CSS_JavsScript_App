import { useState, useEffect } from "react";
import BookForm from "./components/form/BookForm";
import BookTable from "./components/table/BookTable";
import Message from "./components/Message.jsx";
import { getBooks, createBook, updateBook, deleteBook } from "./api/books";
import "./form.css";

const initialFormState = {
    title: "",
    author: "",
    isbn: "",
    price: "",
    publishDate: "",
    detail: {
        description: "",
        language: "",
        pageCount: "",
        publisher: "",
        coverImageUrl: "",
        edition: ""
    }
};

const App = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(initialFormState);
    const [editingBookId, setEditingBookId] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => { loadBooks(); }, []);

    const loadBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (Object.keys(initialFormState.detail).includes(name)) {
            setForm(prevForm => ({
                ...prevForm,
                detail: {
                    ...prevForm.detail,
                    [name]: value
                }
            }));
        } else {
            setForm(prevForm => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBookId) {
                await updateBook(editingBookId, form);
                setMessage({ type: "success", text: "서적이 수정되었습니다." });
            } else {
                await createBook(form);
                setMessage({ type: "success", text: "서적이 등록되었습니다." });
            }
            setForm(initialFormState);
            setEditingBookId(null);
            loadBooks();
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    const handleEdit = (id) => {
        const book = books.find(b => b.id === id);
        if (book) {
            setForm({
                title: book.title || "",
                author: book.author || "",
                isbn: book.isbn || "",
                price: book.price || "",
                publishDate: book.publishDate || "",
                detail: {
                    description: book.detail?.description || "",
                    language: book.detail?.language || "",
                    pageCount: book.detail?.pageCount || "",
                    publisher: book.detail?.publisher || "",
                    coverImageUrl: book.detail?.coverImageUrl || "",
                    edition: book.detail?.edition || ""
                }
            });
            setEditingBookId(id);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteBook(id);
            setMessage({ type: "success", text: "서적이 삭제되었습니다." });
            loadBooks();
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    const handleCancel = () => {
        setForm(initialFormState);
        setEditingBookId(null);
    };

    return (
        <div className="app">
            <h1>도서관리시스템</h1>
            <Message type={message.type} text={message.text} />
            <BookForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                editingBook={editingBookId !== null}
                onCancel={handleCancel}
            />
            <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default App;