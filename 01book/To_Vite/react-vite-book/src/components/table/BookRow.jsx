const BookRow = ({ book, onEdit, onDelete }) => (
    <tr>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td>{book.isbn ?? "-"}</td>
        <td>{book.price ?? "-"}</td>
        <td>{book.publishDate ?? "-"}</td>
        <td>{book.detail?.description ?? "-"}</td>
        <td>{book.detail?.language ?? "-"}</td>
        <td>{book.detail?.pageCount ?? "-"}</td>
        <td>{book.detail?.publisher ?? "-"}</td>
        <td>{book.detail?.coverImageUrl ?? "-"}</td>
        <td>{book.detail?.edition ?? "-"}</td>
        <td>
            <button onClick={() => onEdit(book.id)}>수정</button>
            <button onClick={() => onDelete(book.id, book.title)}>삭제</button>
        </td>
    </tr>
);

export default BookRow;
