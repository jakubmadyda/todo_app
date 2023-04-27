import { useState } from 'react';

function App() {
    const [task, setTask] = useState('');

    return (
        <>
            <form action="">
                <label htmlFor="task">Task</label>
                <input
                    id="task"
                    type="text"
                    value={task}
                    onChange={e => setTask(e.target.value)}
                />
                <button>Add</button>
            </form>
        </>
    );
}

export default App;
