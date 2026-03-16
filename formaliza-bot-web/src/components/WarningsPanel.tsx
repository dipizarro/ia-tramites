import { WarningItem } from "@/types/api"

export default function WarningsPanel({ items }: { items: WarningItem[] }) {

    return (

        <div>

            <h3>Advertencias</h3>

            {items.map((w, i) => (
                <div key={i}>
                    <b>{w.title}</b>
                    <p>{w.detail}</p>
                </div>
            ))}

        </div>

    )
}