import CustomPieChart from '../Charts/CustomPieChart'


const COLORS = [
    "#1f77b4", // blue
    "#ff7f0e", // orange
    "#2ca02c", // green
    "#d62728", // red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
]

const TagCloud = ({ tags }) => {
    const maxCount = Math.max(...tags.map((tag) => tag.count), 1)

    return (
        <div className='flex flex-wrap gap-2'>
            {tags.map((tag) => {
                const fontSize = 12 + (tag.count / maxCount) * 5
                return (
                    <span
                        key={tag.name}
                        className='font-medium text-sky-900/80 bg-sky-100 px-3 py-0.5 rounded-lg '
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        #{tag.name}
                    </span>
                )
            })}
        </div>
    )
}

const TagInsights = ({ tagUsage }) => {
    // Guard against undefined tagUsage
    if (!tagUsage || tagUsage.length === 0) {
        return <div className='text-center text-gray-500 py-8'>No tag data available</div>
    }

    const processData = (() => {
        const sorted = [...tagUsage].sort((a, b) => b.count - a.count)
        const topFour = sorted.slice(0, 4)
        const others = sorted.slice(4)

        const othersCount = others.reduce((sum, item) => sum + item.count, 0)

        const finalData = topFour.map((item) => ({
            ...item,
            name: item.tag || ""
        }))

        if (othersCount > 0) {
            finalData.push({
                name: "Others",
                count: othersCount
            })
        }
        return finalData
    })()

    return (
        <div className='grid grid-cols-12 mt-4'>
            <div className='col-span-12 md:col-span-7'>
                <CustomPieChart data={processData} colors={COLORS} />
            </div>

            <div className='col-span-12 md:col-span-5 mt-5 md:mt-0'>
                <TagCloud
                    tags={tagUsage.slice(0, 15).map((item) => ({
                        ...item,
                        name: item.tag || "",
                    }))}
                />
            </div>
        </div>
    )
}

export default TagInsights