<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <Card>
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>干净 快捷的区块链账本.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">账号名</Label>
              <Input id="name" placeholder="输入账户名" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="name">密码</Label>
              <Input id="name" placeholder="输入密码" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline"> 注册 </Button>
        <Button>登录</Button>
      </CardFooter>
    </Card>
  </div>
</template>
