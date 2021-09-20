import { Text, TextProps } from "@chakra-ui/react"
import { DateTime } from "luxon"
import React, { useEffect, useMemo, useState } from "react"

export type CountdownProps = {
  to: DateTime
  forceReady?: boolean
  readyText?: string
  textProps?: Partial<TextProps>
}

export const Countdown: React.FC<CountdownProps> = ({ to, forceReady, textProps, readyText }) => {

  const [compareDate, setCompareDate] = useState(DateTime.now())

  const countdownText = useMemo(() => {
    let durationRemaining = to.diff(compareDate)
    if (forceReady || (durationRemaining.as("seconds") < 0)) {
      return readyText ?? "00:00:00:00"
    }

    return durationRemaining.toFormat("dd:hh:mm:ss")
  }, [to, forceReady, compareDate, readyText])

  useEffect(() => {
    if (forceReady) return

    const interval = setInterval(() => {
      setCompareDate(DateTime.now)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [forceReady])

  return (
    <Text letterSpacing="4px" {...textProps}>{countdownText}</Text>
  )
}
