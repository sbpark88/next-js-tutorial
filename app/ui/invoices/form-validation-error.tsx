interface Props {
   id: string;
   errors: string[] | undefined;
 }

 export default function FormValidationError({ id, errors }: Props) {
   return (
     <div id={id} aria-live="polite" aria-atomic="true">
       {errors?.map((error: string) => (
         <p key={error} className="mt-2 text-sm text-red-500">
           {error}
         </p>
       ))}
     </div>
   );
 }
