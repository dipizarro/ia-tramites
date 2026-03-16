import { ChecklistItem } from "@/types/api"

export default function ChecklistPanel({ items }: { items: ChecklistItem[] }) {

    return (

        <div>

            <h3>Checklist</h3>

            {items.map((c, i) => (
                <div key={i}>
                    <b>{c.title}</b>
                    <p>{c.detail}</p>
                </div>
            ))}

        </div>

    )
}