import { Link } from 'react-router-dom'
import { T } from '../components/ui/T'
import Icon from '../components/ui/Icon'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[62vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-royal">
        <Icon name="map-pin" size={24} />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-navy"><T><T>Off the corridor</T></T></h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
        That page isn't on the ETS line. Head back to discovery and pick a station.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link to="/explore">
          <Button iconRight="arrow-right"><T><T>Browse experiences</T></T></Button>
        </Link>
        <Link to="/">
          <Button variant="ghost"><T><T>Back home</T></T></Button>
        </Link>
      </div>
    </div>
  )
}
