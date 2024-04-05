import { useRef, useState } from 'react';
import './Kanban.css';
import Column from '../Column/Column';
import { StatusEnum } from '../../types/index'; 


const Kanban = ({ data }) => {
  const [dataLists, setDataLists] = useState(data);
  const [dragging, setDragging] = useState(false);
  

  const dragItem = useRef(null);
  const dragNode = useRef(null);

  const handleDragStart = (event, task) => {
    dragItem.current = task;
    dragNode.current = event.target;
    if (dragNode.current) {
      dragNode.current.addEventListener('dragend', handleDragEnd);
    }
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (event, task) => {
    const currentItem = dragItem.current;
    const draggedTask = dataLists[currentItem.tableIndex].tasks[currentItem.taskIndex];
    
    if (event.target !== dragNode.current) {
      if (dataLists[task.tableIndex].status === StatusEnum.FINAL && draggedTask.id % 2 === 0) {
        return; 
      }

      setDataLists((oldList) => {
        const newList = JSON.parse(JSON.stringify(oldList));
        const removedTask = newList[currentItem.tableIndex].tasks.splice(currentItem.taskIndex, 1)[0];
        newList[task.tableIndex].tasks.splice(task.taskIndex, 0, removedTask);
        dragItem.current = { ...currentItem, tableIndex: task.tableIndex, taskIndex: task.taskIndex };
        return newList;
      });
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    if (dragNode.current) {
      dragNode.current.removeEventListener('dragend', handleDragEnd);
    }
    dragItem.current = null;
    dragNode.current = null;
  };

  const getStyles = (task) => {
    const currentItem = dragItem.current;
    if (currentItem && currentItem.tableIndex === task.tableIndex && currentItem.taskIndex === task.taskIndex) {
      return 'current single-task';
    }
    return 'single-task';
  };

  return (
    <div className='board-container'>
      <div className="container">
        <div className="board-content">
          {dataLists.map((table, tableIndex) => (
            <Column 
              key={table.id}
              status={table.status}
              tasks={table.tasks}
              tableIndex={tableIndex}
              dragging={dragging}
              handleDragEnter={handleDragEnter}
              handleDragStart={handleDragStart}
              getStyles={getStyles}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Kanban;