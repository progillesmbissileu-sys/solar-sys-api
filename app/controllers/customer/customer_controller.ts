import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { CreateCustomerCommand } from '#kernel/customer/application/command/create_customer_command'
import { CreateAddressCommand } from '#kernel/customer/application/command/create_address_command'
import type { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import type { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { AddressType } from '#kernel/customer/domain/type/address_type'
import {
  createCustomerSchema,
  updateCustomerSchema,
  createAddressSchema,
  updateAddressSchema,
} from '#validators/customer_validator'

@inject()
export default class CustomerController {
  constructor(
    private commandBus: CommandBus,
    private customerRepository: CustomerRepository,
    private addressRepository: AddressRepository
  ) {}

  /**
   * List all customers
   */
  async index({ response }: HttpContext) {
    const customers = await this.customerRepository.findAll()
    return response.ok({
      status: 'success',
      data: customers.map((c) => this.serializeCustomer(c)),
    })
  }

  /**
   * Get a single customer by ID
   */
  async show({ params, response }: HttpContext) {
    const customer = await this.customerRepository.findById(params.id)
    return response.ok({
      status: 'success',
      data: this.serializeCustomer(customer),
    })
  }

  /**
   * Create a new customer
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCustomerSchema)

    const command = new CreateCustomerCommand(
      payload.first_name,
      payload.last_name,
      payload.phone,
      payload.email ?? undefined
    )

    const customerId = await this.commandBus.execute(command)

    return response.created({
      status: 'success',
      message: 'Customer created successfully',
      data: { id: customerId },
    })
  }

  /**
   * Update a customer
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCustomerSchema)

    const customer = await this.customerRepository.findById(params.id)

    if (payload.first_name) customer.setFirstName(payload.first_name)
    if (payload.last_name) customer.setLastName(payload.last_name)
    if (payload.phone) customer.setPhone(payload.phone)
    if (payload.email !== undefined) {
      customer.setEmail(payload.email)
    }

    await this.customerRepository.save(customer)

    return response.ok({
      status: 'success',
      message: 'Customer updated successfully',
      data: this.serializeCustomer(customer),
    })
  }

  /**
   * Get customer addresses
   */
  async addresses({ params, response }: HttpContext) {
    const addresses = await this.addressRepository.findByCustomerId(params.id)
    return response.ok({
      status: 'success',
      data: addresses.map((a) => this.serializeAddress(a)),
    })
  }

  /**
   * Add address to customer
   */
  async addAddress({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createAddressSchema)

    const command = new CreateAddressCommand(
      params.id,
      payload.address_line1,
      payload.address_line2 || null,
      payload.city,
      payload.state,
      payload.postal_code,
      payload.country,
      payload.type as AddressType,
      payload.is_default || false
    )

    const addressId = await this.commandBus.execute(command)

    return response.created({
      status: 'success',
      message: 'Address added successfully',
      data: { id: addressId },
    })
  }

  /**
   * Update an address
   */
  async updateAddress({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateAddressSchema)

    const address = await this.addressRepository.findById(params.addressId)

    if (payload.address_line1) address.setAddressLine1(payload.address_line1)
    if (payload.address_line2 !== undefined) address.setAddressLine2(payload.address_line2)
    if (payload.city) address.setCity(payload.city)
    if (payload.state) address.setState(payload.state)
    if (payload.postal_code) address.setPostalCode(payload.postal_code)
    if (payload.country) address.setCountry(payload.country)
    if (payload.type) address.setType(payload.type as AddressType)
    if (payload.is_default !== undefined) address.setDefault(payload.is_default)

    await this.addressRepository.save(address)

    return response.ok({
      status: 'success',
      message: 'Address updated successfully',
      data: this.serializeAddress(address),
    })
  }

  /**
   * Delete an address
   */
  async deleteAddress({ params, response }: HttpContext) {
    await this.addressRepository.delete(params.addressId)
    return response.ok({
      status: 'success',
      message: 'Address deleted successfully',
    })
  }

  private serializeCustomer(customer: any) {
    return {
      id: customer.getId(),
      first_name: customer.getFirstName(),
      last_name: customer.getLastName(),
      phone: customer.getPhone(),
      email: customer.getEmail(),
      created_at: customer.getCreatedAt(),
      updated_at: customer.getUpdatedAt(),
    }
  }

  private serializeAddress(address: any) {
    return {
      id: address.getId(),
      customer_id: address.getCustomerId(),
      address_line1: address.getAddressLine1(),
      address_line2: address.getAddressLine2(),
      city: address.getCity(),
      state: address.getState(),
      postal_code: address.getPostalCode(),
      country: address.getCountry(),
      type: address.getType(),
      is_default: address.getIsDefault(),
      created_at: address.getCreatedAt(),
      updated_at: address.getUpdatedAt(),
    }
  }
}
