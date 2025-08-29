import FormField from "./FormField";

const BookForm = ({ form, onChange, onSubmit, editingBook, onCancel }) => (
    <form onSubmit={onSubmit} className="book-form">
        <FormField label="제목" name="title" value={form.title} onChange={onChange} />
        <FormField label="저자" name="author" value={form.author} onChange={onChange} />
        <FormField label="ISBN" name="isbn" value={form.isbn} onChange={onChange} />
        <FormField label="가격" type="number" name="price" value={form.price} onChange={onChange} />
        <FormField label="출판일" type="date" name="publishDate" value={form.publishDate} onChange={onChange} />
        <FormField label="description" name="description" value={form.detail.description} onChange={onChange} />
        <FormField label="language" name="language" value={form.detail.language} onChange={onChange} />
        <FormField label="pageCount" type="number" name="pageCount" value={form.detail.pageCount} onChange={onChange} />
        <FormField label="publisher" name="publisher" value={form.detail.publisher} onChange={onChange} />
        <FormField label="coverImageUrl" name="coverImageUrl" value={form.detail.coverImageUrl} onChange={onChange} />
        <FormField label="edition" name="edition" value={form.detail.edition} onChange={onChange} />

        <div className="button-group">
            <button type="submit">{editingBook ? "서적 수정" : "도서 등록"}</button>
            {editingBook && <button type="button" onClick={onCancel}>취소</button>}
        </div>
    </form>
);

export default BookForm;