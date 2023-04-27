import { useState } from 'react';

function App() {
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');

    return (
        <>
            <form
                onSubmit={e => {
                    e.preventDefault();
                }}
            >
                <label htmlFor="task">Task</label>
                <input
                    id="task"
                    type="text"
                    value={task}
                    onChange={e => setTask(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
                <button type="submit">Add</button>
            </form>
        </>
    );
}

export default App;
