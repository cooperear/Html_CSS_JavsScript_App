import BookRow from "./BookRow";

const BookTable = ({ books, onEdit, onDelete }) => (
    <table>
        <thead>
            <tr>
                <th>제목</th>
                <th>저자</th>
                <th>ISBN</th>
                <th>가격</th>
                <th>출판일</th>
                <th>description</th>
                <th>language</th>
                <th>pageCount</th>
                <th>publisher</th>
                <th>coverImageUrl</th>
                <th>edition</th>
                <th>액션</th>
            </tr>
        </thead>
        <tbody>
            {books.map((book) => (
                <BookRow key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </tbody>
    </table>
);

export default BookTable;
