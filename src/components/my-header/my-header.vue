<template>
	<div class="my-header">
		<img class="img" src="./logo2.png" alt="" />
		<span class="text">Chicken Music</span>
		<span class="icon-wrapper" @click="toUserPage">
			<i class="iconfont icon-mine"></i>
		</span>
	</div>
</template>

<script>
export default {
	name: 'myHeader',
	data() {
		return {};
	},
	methods: {
		toUserPage() {
			this.$router.push('/user');
		},
	},
};
</script>

<style lang="scss" scoped>
.my-header {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	background-color: $color-background;

	.img {
		width: 30px;
	}
	.text {
		margin-left: 8px;
		color: $color-theme;
		font-size: $font-size-large;
	}
	.icon-wrapper {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 15px;
		i {
			color: $color-theme;
			font-size: 20px;
		}
	}
}
</style>
