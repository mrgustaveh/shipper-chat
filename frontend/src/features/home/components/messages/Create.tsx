import { TbPencilPlus } from "react-icons/tb";
import "./create.scss";

export const CreateMessage = () => {
  return (
    <div className="create_message">
      <p>All Messages</p>

      <button className="create">
        <TbPencilPlus size={16} />
        New Message
      </button>
    </div>
  );
};
