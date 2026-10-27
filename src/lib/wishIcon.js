import { Plane, Smartphone, Laptop, Car, Gift, Music, Shirt, Utensils, Dumbbell, Home, ShieldCheck, CreditCard, Gamepad2, Camera, Bike, GraduationCap, Heart, PiggyBank } from 'lucide-react'

const RULES = [
  [/trip|travel|flight|getaway|vacation|beach|cruise|hotel/i, Plane],
  [/phone|iphone|pixel|galaxy/i, Smartphone],
  [/laptop|computer|macbook|pc\b|ipad|tablet/i, Laptop],
  [/\bcars?\b|truck|tires/i, Car],
  [/concert|ticket|festival|show|music|guitar|headphones|airpods/i, Music],
  [/shoe|sneaker|clothes|jacket|outfit|shirt|dress/i, Shirt],
  [/dinner|restaurant|food|meal|steak|sushi/i, Utensils],
  [/gym|fitness|weights|yoga|peloton/i, Dumbbell],
  [/house|home|rent|apartment|couch|furniture|bed/i, Home],
  [/emergency|savings|cushion|rainy/i, ShieldCheck],
  [/card|debt|loan|bill|pay off/i, CreditCard],
  [/game|playstation|xbox|switch|console/i, Gamepad2],
  [/camera|lens/i, Camera],
  [/bike|bicycle|scooter/i, Bike],
  [/class|course|school|tuition|degree/i, GraduationCap],
  [/ring|date|anniversary|girlfriend|boyfriend|wife|husband|partner/i, Heart],
  [/gift|present|birthday|christmas/i, Gift],
]
export const wishIcon = name => RULES.find(([re]) => re.test(name))?.[1] || PiggyBank
