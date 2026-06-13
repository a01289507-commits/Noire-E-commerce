import { type SchemaTypeDefinition } from 'sanity'
import {categoryType} from './categoryType'
import {productType} from './productType'
import {orderType} from './order'
import { headerType } from './header'
import { heroType  } from './heroType'
import { aboutPageType  } from './aboutPage'
import { contactPageType } from './contactPage'
import {footerType} from './footer'
import {cartType} from './cart'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ headerType,heroType ,categoryType,productType,orderType,aboutPageType,contactPageType,footerType,cartType],
}
