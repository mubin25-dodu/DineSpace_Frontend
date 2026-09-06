export default function Togglebutton({ ischecked }: { ischecked: boolean }) {
   return (
      <input
         type="checkbox"
         checked={ischecked}
         readOnly
         className="toggle border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
      />
   );
}