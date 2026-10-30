package com.example.kamati.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.kamati.ui.theme.GoldStar

@Composable
fun StarRatingBar(
    rating: Double,
    totalRatings: Int = 0,
    starSize: Dp = 18.dp,
    interactive: Boolean = false,
    userRating: Int = 0,
    onRate: ((Int) -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        modifier = modifier
    ) {
        val displayRating = if (interactive && userRating > 0) userRating.toDouble() else rating

        for (i in 1..5) {
            val isFilled = i <= displayRating
            Icon(
                imageVector = if (isFilled) Icons.Default.Star else Icons.Outlined.Star,
                contentDescription = "$i Stars",
                tint = if (isFilled) GoldStar else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                modifier = Modifier
                    .size(starSize)
                    .then(
                        if (interactive && onRate != null) {
                            Modifier
                                .clickable { onRate(i) }
                                .padding(2.dp)
                        } else Modifier
                    )
            )
        }

        if (!interactive) {
            Text(
                text = String.format("%.1f", rating),
                style = MaterialTheme.typography.labelSmall.copy(fontSize = 12.sp),
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(start = 2.dp)
            )
            if (totalRatings > 0) {
                Text(
                    text = "($totalRatings)",
                    style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
