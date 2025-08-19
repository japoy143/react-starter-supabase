import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

type Todo = {
  id: number;
  name: string;
  is_completed: boolean;
  created_at: string;
};

export default function Todo() {
  const [todolist, setTodoList] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  //supabase

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("Todolist").select("*");
    if (error) {
      console.log("Error fetching: ", error);
    } else {
      setTodoList(data as Todo[]);

      console.log(data);
    }
  };

  //create
  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      is_completed: false,
    };
    const { data, error } = await supabase
      .from("Todolist")
      .insert([newTodoData])
      .select()
      .single();

    if (error) {
      console.log("Error adding todo:", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo("");
      console.log("successfully added todo");
    }
  };

  //update
  const completeTask = async (id: number, isComplete: boolean) => {
    const { data, error } = await supabase
      .from("Todolist")
      .update({ is_completed: !isComplete })
      .eq("id", id);

    if (error) {
      console.log("error toggling task: ", error);
    } else {
      const updateTodoList = todolist.map((todo) =>
        todo.id === id ? { ...todo, is_completed: !isComplete } : todo
      );

      setTodoList(updateTodoList);
    }
  };

  const deleteTask = async (id: number) => {
    const { data, error } = await supabase
      .from("Todolist")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("error deleting task task: ", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <p>Todo</p>

      <div className="mt-6">
        <input
          type="text"
          name="todo"
          value={newTodo}
          placeholder="todo"
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo Item</button>
      </div>

      <ul className=" mt-6">
        {todolist.map((todo) => (
          <li key={todo.id}>
            <p>{todo.name}</p>
            <button onClick={() => completeTask(todo.id, todo.is_completed)}>
              {todo.is_completed ? "Undo" : "Completed Task"}
            </button>

            <button className="block" onClick={() => deleteTask(todo.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
