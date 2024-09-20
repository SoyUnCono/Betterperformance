import { currentUser } from "@clerk/nextjs/server"

export default function Account() {
const UserData = currentUser();


return <div>
    
</div>
}