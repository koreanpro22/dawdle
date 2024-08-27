import Image from "next/image"
import Link from "next/link";

interface GroupProps {
  id: number;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventMembers: string[];
  groupImgSrc: string;
}

// Interface for the object that includes GroupProps
interface Group {
  group: GroupProps;
}

export default function GroupCard({ group }: Group) {
  return (
    <Link href={`/group/${group.id}`}>
      <button className="w-full relative">
        <h2 className="text-left rounded-t-md bg-primary-accent-color text-primary-text-color p-1 text-xl">{group.eventName}</h2>
        <div className="h-32">
          <Image
           src={group.groupImgSrc}
           width={0}
           height={0}
           alt="Picture of the author"
           sizes="100vw"
           className="w-full h-full object-cover rounded-b-md" />
        </div>
        <div className="bg-primary-accent-color py-2 px-3 rounded-full absolute bottom-2 right-2">
          <p className="text-primary-text-color font-[800]">🦆 {group.eventMembers.length}</p>
        </div>
      </button>
    </Link>
  )
}