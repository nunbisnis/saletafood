"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type OrderItemInput = {
  productId: string;
  quantity: number;
  price: number;
};

export type OrderFormData = {
  userId: string;
  items: OrderItemInput[];
  total: number;
};

export async function getOrders(limit?: number) {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize orders to handle Decimal values
    const serializedOrders = orders.map((order) => ({
      ...order,
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        price: parseFloat(item.price.toString()),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        product: {
          ...item.product,
          price: parseFloat(item.product.price.toString()),
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
        },
      })),
    }));

    return { orders: serializedOrders };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { error: "Failed to fetch orders" };
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize orders to handle Decimal values
    const serializedOrders = orders.map((order) => ({
      ...order,
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        price: parseFloat(item.price.toString()),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        product: {
          ...item.product,
          price: parseFloat(item.product.price.toString()),
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
        },
      })),
    }));

    return { orders: serializedOrders };
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return { error: "Failed to fetch user orders" };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return { error: "Order not found" };
    }

    // Serialize order to handle Decimal values
    const serializedOrder = {
      ...order,
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        price: parseFloat(item.price.toString()),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        product: {
          ...item.product,
          price: parseFloat(item.product.price.toString()),
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
        },
      })),
    };

    return { order: serializedOrder };
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return { error: "Failed to fetch order" };
  }
}

export async function createOrder(formData: OrderFormData) {
  try {
    const order = await prisma.order.create({
      data: {
        userId: formData.userId,
        total: formData.total,
        items: {
          create: formData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/admin/dashboard/orders");

    // Serialize order to handle Decimal values
    const serializedOrder = {
      ...order,
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        price: parseFloat(item.price.toString()),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    };

    return { order: serializedOrder };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { error: "Failed to create order" };
  }
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
) {
  try {
    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    revalidatePath("/admin/dashboard/orders");
    revalidatePath(`/admin/dashboard/orders/${id}`);

    // Serialize order to handle Decimal values
    const serializedOrder = {
      ...order,
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return { order: serializedOrder };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { error: "Failed to update order status" };
  }
}
